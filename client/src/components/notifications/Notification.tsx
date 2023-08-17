import { Drawer, IconButton, ListItem, ListItemButton, ListItemText, List, Box, ListItemAvatar, Avatar, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import NotificationContext from "../../context/NotificationProvider";
import { useContext, useEffect, useState } from "react";
import { EnrichedNotification } from "../../../../comon_src/type/utils.type";
import { useNavigate } from "react-router-dom";
import apiProvider from "../../services/apiProvider";
import { prefixBackendUrl } from "../../utils";

const notificationArray = {
	like: ["has liked your profile", "profile"],
	message: ["has sent you a message", "chat"],
	visit: ["has visited your profile", "profile"],
	match: ["It's a match!!", "chat"],
	unlike: ["has unliked your profile", "profile"]
};

function createNotifications(notifications: EnrichedNotification[], toggleNotification: () => void): JSX.Element {
	const navigate = useNavigate();

	const navTo = (id: number, url: string) => {
		navigate(`/${url}/${id}`);
		toggleNotification();
	};

	const notificationList = notifications.map((notification) => {
		const [msg, url] = notificationArray[notification.type];
		return (
			<ListItem divider alignItems="flex-start" key={notification.id} onClick={() => navTo(notification.fromId, url)} disablePadding sx={{ backgroundColor: !notification.read ? "rgba(0,0,0,0.1)" : "inherit" }}>
				<ListItemButton>
					<ListItemAvatar>
						<Avatar alt={notification.username} src={prefixBackendUrl(notification.profilePicture)} />
					</ListItemAvatar>
					<ListItemText
						primary={notification.username}
						secondary={
							<>
								<Typography>
									{msg}
								</Typography>
								{notification.date.toLocaleString()}
							</>
						}
						primaryTypographyProps={{ fontWeight: !notification.read ? "bold" : "normal" }}
						secondaryTypographyProps={{ fontWeight: !notification.read ? "bold" : "normal" }}
					/>
				</ListItemButton>
			</ListItem>
		);
	});
	return <>{notificationList}</>;
}

export default function Notification({ toggleNotification, open }: { toggleNotification: () => void, open: boolean | undefined }) {
	const { notifications } = useContext(NotificationContext);
	const [enrichedNotifications, setEnrichedNotifications] = useState<EnrichedNotification[]>([]);

	useEffect(() => {
		const fetchProfiles = async () => {
			const data = await Promise.all(notifications.map(async (notification) => {
				const res = await apiProvider.getProfile(notification.fromId.toString());
				return {
					...notification,
					username: res.data.username,
					profilePicture: res.data.pictures[0]?.src,
				};
			}));
			setEnrichedNotifications(data);
		};

		fetchProfiles();
	}, [notifications]);

	return (
		<>
			<Drawer
				anchor="right"
				open={open}
				onClose={toggleNotification}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<IconButton onClick={toggleNotification} sx={{ ml: "auto", display: "block", m: 1 }}>
						<Close />
					</IconButton>
				</Box>
				<List>
					{createNotifications(enrichedNotifications, toggleNotification)}
				</List>
			</Drawer>
		</>
	);
}