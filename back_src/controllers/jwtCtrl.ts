import { askNewJwt } from "../utils/jwt";
import { Request, Response } from "express";

export async function createNewJwt(req:Request, res:Response) {
	const { refreshToken, id } = req.body;
	if (!refreshToken || !id) {
		res.status(405).json({ error: "Missing required data" });
	}
	const newJwt = await askNewJwt(refreshToken, id);
	if("error" in newJwt){
		//TODO faire une liste derreur ? je sait pas en tout cas 500 ne correspondras pas a tout 
		res.status(500).json({error : newJwt.error });
	}
	res.status(200).json({newJwt});
}