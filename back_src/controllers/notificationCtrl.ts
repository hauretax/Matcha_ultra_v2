import InsertDb from "../database/Insert.db";
import { notification, notificationType } from "../../comon_src/type/utils.type";
import { sendNotification } from "./socketCtrl";
import { Request, Response } from "express";
import UpdateDb from "../database/Update.db";
import GetDb from "../database/Get.db";
import FindDb from "../database/Find.db";

export async function newNotification(type: notificationType, fromId: number, toId: number) {

	if (!type || !fromId || !toId) {
		throw new Error("Missing required parameters");
	}
	const isbloqued = await GetDb.isbloqued(fromId, toId);
	if (isbloqued.result){
		return ;
	}
	const dbNotification = await InsertDb.notification(fromId, toId, type) as unknown;
	const notification  = dbNotification as notification;
	const user = await FindDb.userById(notification.fromId);
	notification.fromUsername = user.username;
	sendNotification(notification);
}

export async function getNotification(_: Request, res: Response){
	const notification = await GetDb.notification(res.locals.fulluser.id);
	res.status(200).json(notification);
}

export async function seeNotification(_: Request, res: Response){
	await UpdateDb.notificationToRead(res.locals.fulluser.id);
	res.status(200).json({ error: "user not found" });
}

