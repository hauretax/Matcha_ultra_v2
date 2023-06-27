import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import sendEmail from "../utils/sendMail";
import { GenerateRefreshJwt, generateJwt } from "../utils/jwt";

import { UserPayload, UserProfile } from "../../comon_src/type/user.type";
import { UserReqRegister } from "../../comon_src/type/user.type";

import UserDb from "../database/User.db";
import { UniqueConstraintError } from "../database/errors";

import { checkDataProfilCreate } from "./dataVerifiers/assertedUserData";
import  url  from "url";
import { MulterError } from "multer";



export async function createProfile(req: Request, res: Response) {
	const profile: UserReqRegister = req.body;
	const dataError = checkDataProfilCreate(profile);
	if (dataError) {
		res.status(dataError.code).json({ error: dataError.message });
		return;
	}
	try {
		profile.password = await bcrypt.hash(req.body.password, 10);
		const { id, accessCode, email } = await UserDb.insertUser(profile);
		//TODO: faire un lien en front pour pouvoir verifier le mail (url est pas bon)
		sendEmail(email, "click on this link to activate account :http://" + "localhost:" + "3000/valide_mail?code=" + accessCode + "&email=" + email);
		res.status(201).json({ message: "Profile created", usrId: id });
	} catch (error) {
		if (error instanceof UniqueConstraintError) {
			res.status(409).json({ error: "user or email already taken" });
		} else {
			throw error;  // propagate the error
		}
	}
}

export async function login(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "no credentials provided" });
		return;
	}

	const { username, password } = req.body;
	if (!username || !password) {
		res.status(422).json({ error: "username and/or password missing" });
		return;
	}


	//si un middlwar a deja recuprer l'utilisateur avant darriver ici on recuprer la donner preexistante 
	const fulluser = res?.locals?.fulluser || await UserDb.findUser(username);
	if (!fulluser) {
		res.status(404).json({ error: "account not found" });
		return;
	}

	const isAutorized = await bcrypt.compare(password, fulluser.password);
	if (isAutorized) {
		const { id, email, username, firstName, lastName, biography, gender, age, orientation, emailVerified, pictures, interests } = fulluser;
		const payload: UserPayload = {
			jwtToken: {
				token: generateJwt(id),
				refreshToken: await GenerateRefreshJwt(id),
			},
			profile: {
				id,
				email,
				username,
				lastName,
				firstName,
        biography,
				gender,
				age,
				orientation,
				emailVerified,
				pictures,
				interests
			}
		};
		res.status(200).json(payload);
	} else {
		res.status(401).json({ error: "username and/or password incorrect" });
	}

}

export function getProfile(req: Request, res: Response) {
	const user: UserProfile = res.locals.fulluser as UserProfile;
	res.json({ user });
}

export async function getOptions(req: Request, res: Response) {
	const options = await UserDb.getAllInterests()
	res.json(options);
}

export async function validByEmail(req: Request, res: Response) {
	const requestUrl = req.url;

	const parsedUrl = new URL(requestUrl, `http://${req.headers.host}`);
	const queryParameters = parsedUrl.searchParams;
	
	const email = queryParameters.get("email");
	const code = queryParameters.get("code");
	if (!email || !code){
		res.status(400).json({error: "missing parameters"});
		return;
	}
	const dbCode = await UserDb.getCode(email);
	if (dbCode.accessCode != code){
		res.status(404).json({error:"not found"});
		return;
	}

	UserDb.valideUser(email);
	res.sendStatus(200);
	return;
}

export async function updateProfile(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}

	const { firstName, lastName, age, gender, orientation, email } = req.body;

	// Age validation
	if (!Number.isInteger(age) || age < 0 || age > 120) {
		res.status(400).json({ error: "invalid age" });
		return;
	}

	// Gender validation
	if (!["Male", "Female", "Other"].includes(gender)) {
		res.status(400).json({ error: "invalid gender" });
		return;
	}

	// Orientation validation
	if (!["Homosexual", "Heterosexual", "Bisexual"].includes(orientation)) {
		res.status(400).json({ error: "invalid orientation" });
		return;
	}

	// Email validation
	const emailRegexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	if (!emailRegexp.test(email)) {
		res.status(400).json({ error: "invalid email" });
		return;
	}

	await UserDb.updateProfile(firstName, lastName, age, gender, orientation, email, Number(email === res.locals.fulluser.email), res.locals.fulluser.id);
	res.status(200).json({ message: "Profile updated successfully" });
}

export async function updateBio(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}

	const { biography } = req.body;

	// Biography validation
	if (typeof biography !== 'string') {
		res.status(400).json({ error: "Invalid biography. Biography must be a string" });
		return;
	}

	await UserDb.updateBio(biography, res.locals.fulluser.id)
	res.status(200).json({ message: 'Profile updated successfully' });
}

export async function updateInterests(req: Request, res: Response) {
	if (!req.body) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}

	const { interests } = req.body;

	// interests validation
	if (!Array.isArray(interests)) {
		res.status(400).json({ error: "Invalid interest list. Interests must be an array" });
		return;
	}

  if (!interests.every((interest: any) => (typeof interest === 'string' && interest != ''))) {
		res.status(400).json({ error: "Invalid interest list. Interests must be an array of non empty strings" });
		return;
	}

	await UserDb.updateUserInterests(res.locals.fulluser.id, interests)
	res.status(200).json({ message: 'Profile updated successfully' });
}

export async function deletePicture(req: Request, res: Response) {
  const { pictureId } = req.params;

  if (!pictureId || !Number.isInteger(parseInt(pictureId))) {
		res.sendStatus(404);
		return;
	}

  const success = await UserDb.findPictureByIdAndDelete(parseInt(pictureId));

  if (!success) {
    res.sendStatus(404);
		return;
  }

  res.sendStatus(200);
  return;
}

export async function insertPicture(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    next(new MulterError('LIMIT_FILE_COUNT'));
    return;
  }
  
  const { filename } = req.file;
  const { id } = res.locals.fulluser;
  const pictureId = await UserDb.insertPicture(id, filename);
  res.status(200).json({id: pictureId, src: filename});
  return;
}

// No need to check if pictureId is a number or if picture exists. The middleware does it.
export async function updatePicture(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    next(new MulterError('LIMIT_FILE_COUNT'));
    return;
  }

  const { filename } = req.file;
  const { pictureId } = req.params;

  await UserDb.updatePicture(parseInt(pictureId), filename);

  res.status(200).json({id: pictureId, src: filename});
  return;
}