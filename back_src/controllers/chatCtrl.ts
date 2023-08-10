import { Request, Response } from "express";
import GetDb from "../database/Get.db";
import InsertDb from "../database/Insert.db";
import { sendMessage } from "./socketCtrl";
import { validateBody } from "../utils/validateDataHelper";

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
	if (idTo < 0 || isNaN(idTo)) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}
	const chat = await GetDb.chat(idFrom, idTo);
	res.status(200).json({ chat });
}

export async function newMessage(req: Request, res: Response) {
	if (!validateBody(req, ["message", "idTo"], ["string", "number"])) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}

	const { message, idTo } = req.body;
	
	if (message.length > 5000) {
		res.status(400).json({ error: "message too long" });
		return;
	}
	
	//TODO: create middleware to check if users are connected to each other
	if (idTo < 1) {
		res.status(400).json({ error: "Bad Request" });
		return;
	}

	//TODO: add message to notification table
	await InsertDb.message(message, res.locals.fulluser.id, idTo);

	sendMessage(message, res.locals.fulluser.id, idTo);

	res.status(201).json({ message: "OK" });
}