import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocketContext from "../context/SocketProvider";
import { useAuth } from "../context/AuthProvider";
import apiProvider from "../services/apiProvider";
import { buildErrorString, prefixBackendUrl } from "../utils";
import { PersonalProfile } from "../../../comon_src/type/user.type";
import { ErrorResponse } from "../../../comon_src/type/error.type";
import { useSnackbar } from "../context/SnackBar";


interface BackMessage {
	id: number;
	userIdFrom: number;
	userIdTo: number;
	msg: string;
	sendDate: string;
}

interface Chat {
	id: number;
	profilePicture: string;
	username: string;
	read: boolean;
}

interface Message {
	fromMe: boolean;
	timestamp: string;
	msg: string;
}

const ChatPage: React.FC = () => {
	const { idParam } = useParams();
	const [selectedChat, setSelectedChat] = useState<number>(-1);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chats, setChats] = useState<Chat[]>([]);
	const [message, setMessage] = useState<string>("");
	const [loadingMsgs, setLoadingMsgs] = useState<boolean>(false);
	const [loadingChats, setLoadingChats] = useState<boolean>(false);
	const { message: incomingMsg } = useContext(SocketContext);
	const { user } = useAuth();
	const snackbar = useSnackbar();


	useEffect(() => {
		const fetchChats = async () => {
			try {
				setLoadingChats(true);
				const res = await apiProvider.getConversations();
				setChats(res.data.profiles);
				setLoadingChats(false);
				const chatIdx = idParam !== undefined ? res.data.profiles.findIndex((chat: Chat) => chat.id === parseInt(idParam)) : 0;
				setSelectedChat(chatIdx);
			} catch (error) {
				snackbar(buildErrorString(error as ErrorResponse, "Error fetching chats"), "error");
			}
		};

		fetchChats();
	}, [snackbar]);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				setLoadingMsgs(true);
				const res = await apiProvider.getChat(chats[selectedChat].id);
				setMessages(res.data.chat.map((message: BackMessage) => ({
					fromMe: message.userIdFrom !== chats[selectedChat].id,
					timestamp: message.sendDate,
					msg: message.msg,
				})
				));
				setChats(prevChats => {
					const newChats = [...prevChats];
					newChats[selectedChat].read = true;
					return newChats;
				});
				setLoadingMsgs(false);
			} catch (error) {
				snackbar(buildErrorString(error as ErrorResponse, "Error fetching messages"), "error");
			}
		};

		if (selectedChat !== -1)
			fetchMessages();
	}, [selectedChat, snackbar]);

	useEffect(() => {
		if (chats[selectedChat]?.id === incomingMsg.userFrom) {
			setMessages([...messages, { msg: incomingMsg.message, fromMe: false, timestamp: new Date().toLocaleString() }]);
		}

		else if (user?.id === incomingMsg.userFrom) {
			setMessages([...messages, { msg: incomingMsg.message, fromMe: true, timestamp: new Date().toLocaleString() }]);
		}

		else {
			const Change = chats.map(chat => {
				if (chat.id === incomingMsg.userFrom)
					return { ...chat, read: false };
				return chat;
			});
			setChats(Change);
		}

	}, [incomingMsg]);

	const sendMessage = async () => {
		try {
			await apiProvider.insertMessage({ message: message, idFrom: (user as PersonalProfile).id, idTo: chats[selectedChat].id });
		} catch (error) {
			snackbar(buildErrorString(error as ErrorResponse, "Error sending message"), "error");
		}
	};



	return (
		<Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1, width: "100%", maxHeight: "100%" }}>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				flexGrow: 1,
				borderRight: "1px solid black",
				overflowY: "scroll",
				width: { xs: "70px", md: "30%" }
			}}>
				{!loadingChats ?
					chats?.map((chat, index) => (
						<Box
							key={index}
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								padding: "10px",
								cursor: "pointer",
								backgroundColor: selectedChat === index ? "lightgray" : "white",
							}}
							onClick={() => {
								setSelectedChat(index);
							}}
						>
							<img
								src={prefixBackendUrl(chat.profilePicture)}
								alt="profile"
								style={{ width: "50px", height: "50px", borderRadius: "50%" }}
							/>
							<Box sx={{ marginLeft: "10px", fontWeight: chat.read ? "normal" : "bold", display: { xs: "none", md: "block" } }}>
								<Box>{chat.username}</Box>
							</Box>
						</Box>

					)) :
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
						<CircularProgress color="inherit" />
					</Box>
				}
			</Box>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				flexGrow: 1,
				maxHeight: "100%",
				width: {
					xs: "calc(100% - 70px)",
					md: "70%"
				}
			}}>
				<Box>
					{!loadingMsgs ?
						messages?.map((message, index) => (
							<Box
								key={index}
								sx={{
									display: "flex",
									flexDirection: "row",
									justifyContent: !message.fromMe ? "flex-end" : "flex-start",
									alignItems: "center",
									padding: "10px",
								}}
							>
								<Box sx={{ display: "flex", flexDirection: "column" }}>
									<Box
										sx={{
											backgroundColor: message.fromMe ? "lightgray" : "white",
											padding: "10px",
											borderRadius: "10px",
										}}
									>
										{message.msg}
									</Box>
									<Typography sx={{ fontSize: "10px", color: "gray", mt: 1 }}>{message.timestamp}</Typography>
								</Box>
							</Box>
						)) :
						<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
							<CircularProgress color="inherit" />
						</Box>
					}
				</Box>
				<Box sx={{ width: "100%" }}>
					<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "10px" }}>
						<TextField fullWidth value={message} onChange={e => setMessage(e.target.value)} />
						<Button variant="outlined" sx={{ marginLeft: "10px" }} onClick={sendMessage}>Send</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ChatPage;