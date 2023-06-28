import { NextFunction, Request, Response } from "express";
import UserDb from "../database/User.db";
import { validateJwt } from "../utils/jwt";
import { UserProfile } from "../../comon_src/type/user.type";


export async function validsecurRequest(
	req: Request,
	res: Response,
	next: NextFunction
) {
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

		const fulluser: UserProfile | null = await UserDb.findUserById(userId);
		if (!fulluser) {
			res.status(404).json({ error: "user not found" });
			return;
		}

		res.locals.fulluser = fulluser;
		console.log	('qsdqsdqsdqsdqds')
		delete res.locals.fulluser.email;
		next();

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "server error" });
		return;
	}

}
