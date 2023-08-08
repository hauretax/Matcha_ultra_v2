import { NextFunction, Request, Response } from "express";
import { validateJwt } from "../utils/jwt";
import { PersonalProfile } from "../../comon_src/type/user.type";
import FindDb from "../database/Find.db";


export async function validsecurRequest(
	req: Request,
	res: Response,
	next: NextFunction
) {
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

		const fulluser: PersonalProfile | null = await FindDb.userById(userId);
		if (!fulluser) {
			res.status(404).json({ error: "user not found" });
			return;
		}

		res.locals.fulluser = fulluser;
		next();

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "server error" });
		return;
	}

}
