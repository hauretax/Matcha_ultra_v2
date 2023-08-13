import InsertDb from "../database/Insert.db";
import { notification, notificationType } from "../../comon_src/type/utils.type";
import { sendNotification } from "./socketCtrl";
import { Request, Response } from "express";
import UpdateDb from "../database/Update.db";

export async function newNotification(type: notificationType, fromId: number, toId: number) {

	if (!type || !fromId || !toId) {
		throw new Error("Missing required parameters");
	}
	const notification = await InsertDb.notification(fromId, toId, type) as unknown;
	sendNotification(notification as notification);

}


export async function seeNotification(_: Request, res: Response){
	await UpdateDb.notificationToRead(res.locals.fulluser);
	res.status(200).json({ error: "user not found" });
}