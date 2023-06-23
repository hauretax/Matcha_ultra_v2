import { askNewJwt } from "../utils/jwt";
import { Request, Response } from "express";

export async function createNewJwt(req:Request, res:Response) {
	const { refreshToken, id } = req.body;
	if(req.body) {
		res.status(405).json({ error: "Missing required data" });
	}
	if (!refreshToken || !id) {
		res.status(405).json({ error: "Missing required data" });
	}
	const newJwt = await askNewJwt(refreshToken, id);
	if("error" in newJwt){
		res.status(401).json({error : newJwt.error });
	}
	res.status(200).json({newJwt});
}