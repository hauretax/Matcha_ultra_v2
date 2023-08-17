import React, { useEffect, useState, createContext } from "react";
import socketIOClient, { Socket } from "socket.io-client";

import { useAuth } from "./AuthProvider";
import { Notification } from "../../../comon_src/type/utils.type";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useSnackbar } from "./SnackBar";
import { buildErrorString } from "../utils";
import { ErrorResponse } from "../../../comon_src/type/error.type";

interface SocketContextType {
	connectedUsers: number[];
	message: { userFrom: number, message: string };
	notification: Notification | undefined;
}

const SocketContext = createContext<SocketContextType>({
	connectedUsers: [],
	message: { userFrom: -1, message: "default" },
	notification: undefined
});

export default SocketContext;

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [connectedUsers, setConnectedUsers] = useState<number[]>([]);
	const [message, setMessage] = useState<{ userFrom: number, message: string }>({ userFrom: -1, message: "default" });
	const [notification, setNotification] = useState<Notification>();
	const auth = useAuth();
	const snackbar = useSnackbar();

	useEffect(() => {

		const connectSocket = () => {

			const socket = socketIOClient("http://localhost:8080", {
				reconnection: true,
				reconnectionAttempts: 10,
				reconnectionDelay: 1000,
			});

			// Authenticate the user using the JWT token
			const authenticateSocket = () => {
				const accessToken = localStorage.getItem("accessToken");
				socket.emit("authenticate", { accessToken });
			};

			// Handle successful authentication
			const handleAuthenticated = (users: number[]) => {
				setConnectedUsers(users);
			};

			// Handle authentication failure
			const handleUnauthorized = (error: { message: string; }) => {
				snackbar(buildErrorString(error as ErrorResponse, "Socket authentication failed"), "error");
			};

			const handleMessage = ({ message, senderId }: { message: string, senderId: number }) => {
				setMessage({ userFrom: senderId, message });
			};

			const handleNotification = (notification: Notification) => {
				setNotification(notification);
			};

			// Socket connection and authentication
			authenticateSocket();

			socket.on("connectedUsers", handleAuthenticated);
			socket.on("unauthorized", handleUnauthorized);

			socket.on("newNotification", handleNotification);
			socket.on("newMessage", handleMessage);

			// Error handling
			socket.on("connect_error", (error) => {
				snackbar(buildErrorString(error as ErrorResponse, "Socket connection failed"), "error");
			});

			socket.on("error", (error: Error) => {
				snackbar(buildErrorString(error as ErrorResponse, "Socket error"), "error");
			});

			window.addEventListener("beforeunload", () => {
				socket.disconnect();
			});

			return socket;
		};

		let sock: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

		const connectionTimeout = setTimeout(() => {
			sock = connectSocket();
		}, 1000);

		// Clean up the socket connection
		return () => {
			clearTimeout(connectionTimeout);
			setConnectedUsers([]);
			if (sock)
				sock.disconnect();
		};
	}, [auth.user]);

	const contextValue = {
		connectedUsers,
		message,
		notification
	};


	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
}

// function useSocket() {                              
//   return useContext(SocketContext);
// }

// export default useSocket;