import React, { useContext, useEffect, useRef, useState } from "react";

import { TextInput } from "./TextInput";
import { MessageLeft } from "./Message";
import { Box, Paper } from "@mui/material";
import BrowsingChatProfiles from "./Profiles";
import SocketContext from "../../context/SocketProvider";
import { useAuth } from "../../context/AuthProvider";

import { Message, Profile } from "../../../../comon_src/type/utils.type";
import apiProvider from "../../services/apiProvider";
import { useParams } from "react-router-dom";

export default function Chat() {
	const { idParam } = useParams<{ idParam: string }>();
	const containerStyle = {
		display: "flex",
		justifyContent: "space-between",
		height: "200px"
	};

	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [userIdOpenConv, changeActualConv] = useState(parseInt(idParam || "-1"));
	const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

	const { message } = useContext(SocketContext);
	const { user } = useAuth();
	const messageListRef = useRef<HTMLDivElement>(null);

	const handleClickProfile = (userId: number) => {
		changeActualConv(userId);
	};

	//apelle au montage
	useEffect(() => {
		async function fetchProfiles() {
			try {
				const conversations = await apiProvider.getConversations();
				setProfiles(conversations.data.profiles);
			} catch (error) {
				console.error("Erreur lors de la récupération des profils:", error);
			}
		}
		fetchProfiles();
	}, []);

	// changement de conversation
	useEffect(() => {
		if (userIdOpenConv < 1)
			return;
		setMessages([]);
		const Change = profiles.map(profile => {
			if (profile.id === userIdOpenConv)
				return { ...profile, haveUnseeMessage: false };
			return profile;
		});
		setProfiles(Change);
		async function fetchMessage() {
			try {
				const fetchedMessage = await apiProvider.getChat(userIdOpenConv);
				setMessages(fetchedMessage.data.chat);
			} catch (error) {
				console.error("Erreur lors de la récupération des messages:", error);
			}
		}
		fetchMessage();
	}, [userIdOpenConv]);

	// un nouveaux message arrive
	useEffect(() => {
		if (userIdOpenConv === message.userFrom) {
			setMessages([...messages, { msg: message.message, displayName: "none", sendDate: "now" }]);
		}

		else if (user?.id === message.userFrom) {
			setMessages([...messages, { msg: message.message, displayName: "none", sendDate: "now" }]);
		}

		else {
			const Change = profiles.map(profile => {
				if (profile.id === message.userFrom)
					return { ...profile, haveUnseeMessage: true };
				return profile;
			});
			setProfiles(Change);
		}

	}, [message]);

	//fair en sorte de rester en bas du scroll
	useEffect(() => {
		if (messageListRef.current && isScrolledToBottom) {
			const messageList = messageListRef.current;
			messageList.scrollTop = messageList.scrollHeight;
		}

	}, [messages]);



	const checkIsScrolledToBottom = (event: React.UIEvent<HTMLDivElement>) => {
		const div = event.currentTarget;
		const { scrollTop, scrollHeight, clientHeight } = div;
		const isBottom = scrollTop + clientHeight === scrollHeight;
		setIsScrolledToBottom(isBottom);
	};

	return (
		<div style={containerStyle}>

			<Paper sx={{ width: "250px" }}>
				<BrowsingChatProfiles profiles={profiles} handleClickProfile={handleClickProfile} />
			</Paper>

			<Paper sx={{ width: "80%", height: "200px" }}>
				<Paper id="style-1" sx={{ height: "300px" }} >
					<Box onScroll={checkIsScrolledToBottom} ref={messageListRef} sx={{ height: "300px", overflow: "auto" }}>
						{
							messages.map((message, key) => {
								return <MessageLeft
									key={key}
									message={message.msg}
									timestamp={message.sendDate}
									displayName={message.displayName}
									photoURL="https://www.w3schools.com/howto/img_avatar.png"
								/>;
							})
						}
					</Box>
				</Paper>
				<TextInput userTo={userIdOpenConv} userFrom={user?.id || -1} />
			</Paper>

		</div >
	);

}

