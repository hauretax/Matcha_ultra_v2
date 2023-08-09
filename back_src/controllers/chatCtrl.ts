import { Request, Response } from "express";
import GetDb from "../database/Get.db";
import InsertDb from "../database/Insert.db";
import { sendMessage } from "./socketCtrl";

export async function getActualConversations(_: Request, res: Response) {
	const { id } = res.locals.fulluser;
	const profiles = await GetDb.allConversation(id);
	res.status(200).json({ profiles });
}

export async function getChat(req: Request, res: Response) {
	const idFrom = res.locals.fulluser.id;
	if (!req.params.id){
		res.status(400).json({ error: "Bad Request" });
		return;
	}
	const idTo = parseInt(req.params.id);
	if (idTo < 0) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}
	const chat = await GetDb.chat(idFrom, idTo);
	res.status(200).json({ chat });
}

export async function newMessage(req: Request, res: Response) {

	const { message, idFrom, idTo } = req.body;
	if (!message || !idFrom || !idTo) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}
	if (typeof message !== "string" || message.length > 5000) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}
	const parsedIdFrom = parseInt(idFrom);
	const parsedIdTo = parseInt(idTo);
	if (isNaN(parsedIdFrom) || parsedIdFrom < 1 || isNaN(parsedIdTo) || parsedIdTo < 1) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}
	await InsertDb.message(message, parsedIdFrom, parsedIdTo);

	sendMessage(message, parsedIdFrom, parsedIdTo);

	res.status(201).json({ message: "OK" });

}