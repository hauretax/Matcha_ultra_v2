import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import { MulterError } from "multer";
import path from "path";

import sendEmail from "../utils/sendMail";
import { generateRefreshJwt, generateJwt } from "../utils/jwt";
import { validateBody, validateDate, validateInterests, validateMail, validatePictureId } from "../utils/validateDataHelper";

import { UserPayload, UserProfile } from "../../comon_src/type/user.type";
import { UserReqRegister } from "../../comon_src/type/user.type";


import { UniqueConstraintError } from "../database/errors";
import { generateRandomString } from "../utils/random";

import FindDb from "../database/Find.db";
import UpdateDb from "../database/Update.db";
import GetDb from "../database/Get.db";
import InsertDb from "../database/Insert.db";
import DeletDb from "../database/Delet.db";
import { OrderBy, findTenUsersParams } from "../../comon_src/type/utils.type";
import { setUserPosition } from "./localisationCtrl";

import { getDistanceInKm, getAge } from "../utils/misc";

export async function createProfile(req: Request, res: Response) {
	if (!validateBody(req, ["username", "email", "firstName", "lastName", "password"], ["string", "string", "string", "string", "string"])) {
		res.status(400).json({ error: "Missing parameters" });
		return;
	}
	const { username, email, firstName, lastName, password } = req.body;

	if (!validateMail(email)) {
		res.status(400).json({ error: "Invalid email" });
		return;
	}

	const passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
	if (!passwordRegex.test(password)) {
		res.status(400).send({ message: "password must contain at least one lowercase, one uppercase, one digit, one special character (@$!%*?&), and be at least 8 characters long" });
		return;
	}

	try {
		const user: UserReqRegister = {
			username,
			email,
			firstName,
			lastName,
			password: await bcrypt.hash(password, 10),
		};

		const accessCode = await InsertDb.user(user);

		await sendEmail(email, "click on this link to activate account :http://" + "localhost:" + "3000/valide_mail?code=" + accessCode + "&email=" + email);

		res.status(201).json({ message: "Profile created" });
	} catch (error) {
		if (error instanceof UniqueConstraintError) {
			res.status(409).json({ error: "user or email already taken" });
		} else {
			throw error;  // propagate the error
		}
	}
}

export async function login(req: Request, res: Response) {
	if (!validateBody(req, ["username", "password"], ["string", "string"])) {
		res.status(422).json({ error: "username and/or password missing" });
		return;
	}
	const { username, password } = req.body;

	const user = await FindDb.user(username);
	if (!user) {
		res.status(404).json({ error: "account not found" });
		return;
	}

	const checkPassword = await bcrypt.compare(password, user.password);
	if (!checkPassword) {
		res.status(401).json({ error: "username and/or password incorrect" });
		return;
	}

	const { id, email, firstName, lastName, biography, gender, birthDate, orientation, emailVerified, pictures, interests, customLocation, latitude, longitude } = user;
	const payload: UserPayload = {
		jwt: {
			accessToken: generateJwt(id),
			refreshToken: await generateRefreshJwt(id),
		},
		profile: {
			id,
			email,
			username,
			lastName,
			firstName,
			biography,
			gender,
			birthDate,
			orientation,
			emailVerified,
			pictures,
			interests,
			customLocation,
			latitude: latitude?.toString(),
			longitude: longitude?.toString(),
		}
	};
	res.status(200).json(payload);
}

export function getProfile(req: Request, res: Response) {
	const user: UserProfile = res.locals.fulluser;
	res.json(user);
}

export async function getProfileById(req: Request, res: Response) {
	const { id } = req.params;

	const user = await FindDb.userById(parseInt(id));

	if (!user) {
		res.status(404).json({ error: "user not found" });
		return;
	}

	res.json({
		id: user.id,
		username: user.username,
		lastName: user.lastName,
		firstName: user.firstName,
		biography: user.biography,
		gender: user.gender,
		birthDate: user.birthDate,
		orientation: user.orientation,
		pictures: user.pictures,
		interests: user.interests,
		latitude: user.latitude,
		longitude: user.longitude,
		distance: getDistanceInKm(res.locals.fulluser.latitude, res.locals.fulluser.longitude, user.latitude, user.longitude),
		age: getAge(user.birthDate),
	});
}

export async function getOptions(req: Request, res: Response) {
	const options = await GetDb.allInterests();
	res.json(options);
}

export async function validByEmail(req: Request, res: Response) {
	const requestUrl = req.url;

	const parsedUrl = new URL(requestUrl, `http://${req.headers.host}`);
	const queryParameters = parsedUrl.searchParams;

	const email = queryParameters.get("email");
	const code = queryParameters.get("code");
	if (!email || !code) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}
	const dbCode = await GetDb.code(email);
	if (dbCode.accessCode != code) {
		res.status(404).json({ error: "not found" });
		return;
	}

	await UpdateDb.update("users", ["emailVerified"], [true], ["email"], [email]);
	res.sendStatus(200);
	return;
}

export async function updateProfile(req: Request, res: Response) {
	if (!validateBody(req, ["firstName", "lastName", "birthDate", "gender", "orientation", "email", "customLocation"], ["string", "string", "string", "string", "string", "string", "boolean"])) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}
	const { firstName, lastName, birthDate, gender, orientation, email, customLocation } = req.body;

	// Age validation
	if (!validateDate(birthDate)) {
		res.status(400).json({ error: "invalid birthDate" });
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
	if (!validateMail(email)) {
		res.status(400).json({ error: "invalid email" });
		return;
	}

	// TODO #5: if email is updated, send a new validation email

	await UpdateDb.update(
		"users",
		["firstName", "lastName", "birthDate", "gender", "orientation", "email", "emailVerified", "customLocation"],
		[firstName, lastName, birthDate, gender, orientation, email, Number(email === res.locals.fulluser.email), customLocation === true ? 1 : 0],
		["id"],
		[res.locals.fulluser.id]
	);

	if (customLocation) {
		setUserPosition(req, res); //Why not ?
		return;
	}

	res.status(200).json({ message: "Profile updated successfully" });
}

export async function updateBio(req: Request, res: Response) {
	if (!validateBody(req, ["biography"], ["string"])) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}
	const { biography } = req.body;

	await UpdateDb.update("users", ["biography"], [biography], ["id"], [res.locals.fulluser.id]);
	res.status(200).json({ message: "Profile updated successfully" });
}

export async function updateInterests(req: Request, res: Response) {
	if (!validateBody(req, ["interests"], ["object"])) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}
	const { interests }: { interests: Array<string> } = req.body;

	// interests validation
	if (!validateInterests(interests)) {
		res.status(400).json({ error: "Invalid interest list. Interests must be an array of non empty strings" });
		return;
	}

	await InsertDb.userInterests(res.locals.fulluser.id, interests);
	res.status(200).json({ message: "Profile updated successfully" });
}

export async function deletePicture(req: Request, res: Response) {
	const { pictureId } = req.params;

	if (!validatePictureId(pictureId)) {
		res.status(400).send({ error: "Invalid picture id" });
		return;
	}

	const picture = await DeletDb.PictureById(parseInt(pictureId));

	if (!picture) {
		res.status(404).send({ error: "Picture not found" });
		return;
	}

	res.status(200).send({ message: "Picture deleted successfully" });

	// Delete picture from disk
	const filePath = path.join(__dirname, "../../../back_src", "public/images", picture.src);
	try {
		fs.unlinkSync(filePath);
	} catch (error) {
		console.error("Error deleting file:", error);
	}
	return;
}

export async function RequestpasswordReset(req: Request, res: Response) {
	if (!validateBody(req, ["email"], ["string"])) {
		res.status(400).json({ error: "email is missing" });
	}

	const { email } = req.body;

	const user = await GetDb.userbyMail(email);

	if (!user) {
		res.status(404).json({ error: "account not found" });
		return;
	}

	const code = generateRandomString(16);

	await UpdateDb.update("users", ["resetPasswordCode"], [code], ["email"], [email]);

	sendEmail(email, "Click on this link to create a new password: http://" + "localhost:" + "3000/reset_password?code=" + code + "&email=" + email, "[Matcha] Reset password");

	res.status(200).json({ message: "reset password link sent to your mailbox" });
}

export async function passwordReset(req: Request, res: Response) {
	if (!validateBody(req, ["email", "code", "newPassword"], ["string", "string", "string"])) {
		res.status(400).json({ error: "missing parameters" });
		return;
	}

	const { email, code, newPassword } = req.body;

	const user = await GetDb.userbyMail(email);

	if (!user) {
		res.status(404).json({ message: "not found" });
		return;
	}

	if (code !== user.resetPasswordCode) {
		res.status(400).json({ message: "invalid link" });
		return;
	}

	const encryptedPassword = await bcrypt.hash(newPassword, 10);

	await UpdateDb.update("users", ["password", "resetPasswordCode"], [encryptedPassword, null], ["email"], [email]);

	res.status(200).json({ message: "password reset" });
}

export async function insertPicture(req: Request, res: Response, next: NextFunction) {
	if (!req.file) {
		next(new MulterError("LIMIT_FILE_COUNT"));
		return;
	}

	const { filename } = req.file;
	const { id } = res.locals.fulluser;

	const pictureId = await InsertDb.picture(id, filename);

	res.status(200).json({ id: pictureId, src: filename });
	return;
}

// No need to check if pictureId is a number or if picture exists. The middleware does it.
export async function updatePicture(req: Request, res: Response, next: NextFunction) {
	if (!req.file) {
		next(new MulterError("LIMIT_FILE_COUNT"));
		return;
	}

	const { filename } = req.file;
	const { pictureId } = req.params;

	await UpdateDb.update("pictures", ["src"], [filename], ["id"], [parseInt(pictureId)]);

	res.status(200).json({ id: pictureId, src: filename });

	// Delete old picture from disk
	const filePath = path.join(__dirname, "../../../back_src", "public/images", res.locals.picture.src);
	try {
		fs.unlinkSync(filePath);
	} catch (error) {
		console.error("Error deleting file:", error);
	}
	return;
}

export async function getProfiles(req: Request, res: Response) {
	if (!req.query) {
		res.status(400).json({ error: "need argument" });
		return;
	}
	const { distanceMax, ageMin, ageMax, orientation, interestWanted, index, orderBy } = req.query;
	if (!ageMin || !ageMax || !orientation || !index || !distanceMax || !orderBy) {
		res.status(400).json({ error: "invalid gender" });
		return;
	}

	const paramsForSearch: findTenUsersParams = {
		latitude: parseFloat(res.locals.fulluser.latitude),
		longitude: parseFloat(res.locals.fulluser.longitude),
		distanceMax: parseFloat(distanceMax as string),
		ageMin: parseInt(ageMin as string, 10),
		ageMax: parseInt(ageMax as string, 10),
		orientation: (orientation as string).split(",").map((value) => value.trim()),
		interestWanted: (interestWanted as string).split(",").map((value) => value.trim()),
		index: parseInt(index as string),
		orderBy: orderBy as OrderBy,
		userId: res.locals.fulluser.id,
	};

	console.log("------------------", paramsForSearch);

	const profiles = await FindDb.tenUsers(paramsForSearch);

	res.status(200).json(profiles);
	return;
}

