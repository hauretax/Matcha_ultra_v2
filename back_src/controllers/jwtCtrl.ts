import { askNewJwt } from "../utils/jwt";
import { Request, Response } from "express";

export async function createNewJwt(req: Request, res: Response) {
	if (!req.body) {
		res.status(405).json({ error: "Missing required data" });
	}

	const { refreshToken } = req.body;

	if (!refreshToken) {
		res.status(405).json({ error: "Missing required data" });
	}

	try {
		const newJwt = await askNewJwt(refreshToken);
		res.status(200).json(newJwt);
	} catch (err) {
		res.status(401).json({ error: err.message });
	}	
}