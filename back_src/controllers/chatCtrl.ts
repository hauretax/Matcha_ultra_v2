import { Request, Response } from "express";
import GetDb from "../database/Get.db";
import InsertDb from "../database/Insert.db";
import { sendMessage } from "./socketCtrl";

export async function getActualConversations(req: Request, res: Response) {
	//todo tout verifier
	const { id } = res.locals.fulluser;
	const profiles = await GetDb.allConversation(id);
	res.status(200).json({ profiles });
}

export async function getChat(req: Request, res: Response) {
	//todo tout verifier
	const idFrom = res.locals.fulluser.id;
	const idTo = parseInt(req.params.id);
	const chat = await GetDb.chat(idFrom, idTo);
	res.status(200).json({ chat });
}


export async function newMessage(req: Request, res: Response) {
	await InsertDb.message(req.body.message, req.body.idFrom, req.body.idTo);
	sendMessage(req.body.message, req.body.idFrom, req.body.idTo);

	res.status(200).json({ message: "OK" });
}