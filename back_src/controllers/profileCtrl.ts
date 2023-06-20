import { Request, Response } from "express";
import UserDb from "../database/User.db";
import sendEmail from "../utils/sendMail";
import bcrypt from "bcrypt";
import { UserReqRegister } from "../../comon_src/type/user.type";
import { checkDataProfilCreate } from "./dataVerifiers/assertedUserData";
import { GenerateJwt, GenerateRefreshJwt } from "../utils/jwt";


const userDB = new UserDb;

export async function createProfile(req: Request, res: Response) {
	const profile: UserReqRegister = req.body;
	const dataError = checkDataProfilCreate(profile);
	if (dataError) {
		res.status(dataError.code).json({ error: dataError.message });
	}
	try {
		profile.password = await bcrypt.hash(req.body.password, 10);
		const { id, accessCode, email } = await userDB.insertUser(profile);
		//TODO: faire un lien en front pour pouvoir verifier le mail (url est pas bon)
		sendEmail(email, "click on this link to activate account :http://" + "localhost:" + "8080/" + accessCode);
		res.status(201).json({ message: "Profile created", usrId: id });

	} catch (error) {
		if (error === 409) {
			res.status(409).json({ error: "user or email already taken" });
			return;
		}
		console.log("\nregister_error:\n", error);
		res.status(500).json({ error: "Internal Server Error" });
		return;
	}
}

export async function login(req: Request, res: Response) {
	const login: string = req.body.username || req.body.email;
	const password = req.body.password;
	if (!login || !password) {
		res.status(422).json({ error: "Unprocessable Entity" });
		return;
	}
	try {
		const fulluser = await userDB.findUser(login);
		if (fulluser === null) {
			res.status(404).json({ error: "Not Found" });
			return;
		}
		const isAutorized = await bcrypt.compare(password, fulluser.password);
		if (isAutorized) {
			const refreshToken = await GenerateRefreshJwt("" + fulluser.id);
			const token = GenerateJwt("" + fulluser.id);
			const { email, username, firstName, lastName, emailVerified } = fulluser;
			res.status(200).json({
				//TODO Update le readme
				user: { email, username, lastName, emailVerified, firstName },
				tokens: {token, refreshToken}
			});
		} else {
			res.status(401).json({ error: "Unauthorized" });
		}
	} catch (error) {
		console.log("\nlogin_error:\n", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}



// const res = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//     send: jest.fn()
// }  as unknown as Response<any, Record<string, any>>;