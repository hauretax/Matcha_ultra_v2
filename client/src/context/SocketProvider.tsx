import React, { useEffect, useState, createContext } from "react";
import socketIOClient from "socket.io-client";

import { useAuth } from "./AuthProvider";
// import { notification } from "../../../comon_src/type/utils.type";

interface SocketContextType {
  connectedUsers: number[];
  message: { userFrom: number, message: string };
}

const SocketContext = createContext<SocketContextType>({
	connectedUsers: [],
	message: { userFrom: -1, message: "default" }
});

export default SocketContext;

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [connectedUsers, setConnectedUsers] = useState<number[]>([]);
	const [message, setMessage] = useState<{ userFrom: number, message: string }>({ userFrom: -1, message: "default" });

	const auth = useAuth();
	// to usr correct function on socket i need to give context 


	useEffect(() => {
		const socket = socketIOClient("http://localhost:8080");

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
		// const handleUnauthorized = (error: { message: string; }) => {
		// 	// console.log("Socket authentication failed:", error.message);
		// 	// Perform appropriate actions for unauthorized access
		// };

		const handleMessage = ({ message, senderId }: { message: string, senderId: number }) => {
			// console.log("new message");
			setMessage({ userFrom: senderId, message });
		};

		// const handleNotification = (notification:notification)=> {
		// 	// console.log(notification);
		// };

		// Socket connection and authentication
		authenticateSocket();

		socket.on("connectedUsers", handleAuthenticated);
		// socket.on("unauthorized", handleUnauthorized);

		// socket.on("newNotification", handleNotification);
		socket.on("newMessage", handleMessage);
		// Error handling
		// socket.on("connect_error", (error) => {
		// 	// console.log("Socket connection error:", error.message);
		// 	// Perform appropriate actions for connection error
		// });

		// socket.on("error", (error: Error) => {
		// 	// console.error("Socket error:", error.message);
		// 	// Perform appropriate actions for socket error
		// });

		// Clean up the socket connection
		return () => {
			setConnectedUsers([]);
			socket.disconnect();
		};
	}, [auth.user]);

	const contextValue = {
		connectedUsers,
		message
	};


	return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
}

// function useSocket() {                              
//   return useContext(SocketContext);
// }

// export default useSocket;