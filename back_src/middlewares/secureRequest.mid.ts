import { NextFunction, Request, Response } from "express";
import UserDb from "../database/User.db";
import { validateJwt } from "../utils/jwt";


export async function validsecurRequest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.body) {
		res.status(400).json({ error: "no credentials provided" });
		return;
	}

	//TODO opti faire une variable avec une cle usrname et une variable mail valider ?
	try {
		const authHeader = req.headers.authorization as string;
		const token = authHeader && authHeader.split(" ")[1];

		if (!token) {
			res.status(422).json({ error: "header missing" });
			return;
		}

		// returns userId or null
		const userId = validateJwt(token);

		if (!userId) {
			res.status(403).json({ error: "Unauthorized" });
			return;
		}

		const fulluser = await UserDb.findUserById(userId);
		if (fulluser === undefined) {
			res.status(404).json({ error: "user not found" });
			return;
		}
		
		// if (!fulluser?.emailVerified) {
		// 	res.status(422).json({ error: "unverified email" });
		// 	return;
		// }

		res.locals.fulluser = fulluser;
		delete res.locals.fulluser.email;
		next();
		
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "server error" });
		return;
	}

}