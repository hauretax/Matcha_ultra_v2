import { Request, Response } from "express";
import UpdateDb from "../database/Update.db";

export async function noteUserTo(req: Request, res: Response) {
	await UpdateDb.noteUserTo(res.locals.fulluser.id, req.body.userTo, req.body.note);
}