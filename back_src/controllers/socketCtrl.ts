import { validateJwt } from "../utils/jwt";
import FindDb from "../database/Find.db";
import app from "../app";
import { notification } from "../../comon_src/type/utils.type";
import UpdateDb from "../database/Update.db";

export const connectedUsers: Map<string, number> = new Map<string, number>();

function getSocketID(userId: number) {
	const userSockets = [];
	for (const [key, value] of connectedUsers) {
		if (value === userId) {
			userSockets.push(key);
		}
	}
	return userSockets;
}

export function sendNotification(notification: notification) {
	const userSocketsTo = getSocketID(notification.toId);
	userSocketsTo.forEach((socketId) => {
		app.io.to(socketId).emit("newNotification", notification);
	});
}

export function sendMessage(message, idFrom, idTo) {

	const userSocketsTo = getSocketID(idTo);
	const userSocketsFrom = getSocketID(idFrom);

	//on envois deux fois le meme event comme ca le front en as un de moins a ecouter et il geras lui meme pour savoir si il est from ou to
	userSocketsTo.forEach((socketId) => {
		app.io.to(socketId).emit("newMessage", { message, senderId: idFrom });
	});
	userSocketsFrom.forEach((socketId) => {
		app.io.to(socketId).emit("newMessage", { message, senderId: idFrom });
	});
}

export default function handleSocket(socket, io) {
	socket.on("authenticate", async ({ accessToken }) => {

		try {
			const userId = validateJwt(accessToken);
			if (!userId) {
				throw new Error("Invalid token");
			}
			const user = await FindDb.userById(userId);

			if (!user) {
				throw new Error("User not found");
			}

			connectedUsers.set(socket.id, userId);
			io.emit("connectedUsers", Array.from(connectedUsers.values()));
		} catch (error) {
			socket.emit("unauthorized", { message: "Invalid token" });
		}
	});

	socket.on("disconnect", () => {
		const userId = connectedUsers.get(socket.id);
		connectedUsers.delete(socket.id);
		const currentDate = new Date();
		async function updateDb() {
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, "0");
			const day = String(currentDate.getDate()).padStart(2, "0");
			try {
				await UpdateDb.update("users", ["lastConnection"], [`${year}-${month}-${day}`], ["id"], [userId]);
			} catch (error) {
				console.error("socket disconnect error :", error);
			}
		}
		updateDb();
		io.emit("connectedUsers", Array.from(connectedUsers.values()));
	});
}
