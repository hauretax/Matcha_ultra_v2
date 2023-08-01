import { validateJwt } from "../utils/jwt";
import FindDb from "../database/Find.db";
import { Server } from "socket.io";

const connectedUsers: Map<string, number> = new Map<string, number>();


function getSocketID(UserId: number) {
	for (const [key, value] of connectedUsers) {
		if (value === UserId) {
			return key;
		}
	}
	return null;
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

	socket.on("sendMessage", async ({ message, idTo, idFrom }) => {
		socket.emit("messageReceived", { message: "Votre message a été reçu avec succès." });

		io.to(getSocketID(idTo)).emit("newMessage", { message, senderId: idFrom });

	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
		connectedUsers.delete(socket.id);
		io.emit("connectedUsers", Array.from(connectedUsers.values()));
	});
}
