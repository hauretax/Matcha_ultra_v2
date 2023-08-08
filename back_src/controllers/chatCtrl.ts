import { Request, Response } from "express";
import GetDb from "../database/Get.db";
import InsertDb from "../database/Insert.db";
import { sendMessage } from "./socketCtrl";

export async function getActualConversation(req: Request, res: Response) {
	//todo tout verifier
	const { id } = res.locals.fulluser;
	const profiles = await GetDb.allConversation(id);
	res.status(200).json({ profiles });
}

export async function newMessage(req: Request, res: Response) {    
	await InsertDb.message(req.body.message, req.body.idFrom, req.body.idTo);
    sendMessage(req.body.message, req.body.idFrom, req.body.idTo);
    
	res.status(200).json({ message: "OK" });
}