import { Request, Response } from "express";
import InsertDb from "../database/Insert.db";
import { notification, notificationType } from "../../comon_src/type/utils.type";

export async function newNotification(type: notificationType, fromId: number, toId: number) {

	if (!type || !fromId || !toId) {
		throw new Error("Missing required parameters");
	}
	const notification = await InsertDb.notification(fromId, toId, type);
	console.log(notification);
}