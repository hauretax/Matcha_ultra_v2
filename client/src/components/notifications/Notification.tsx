import { Drawer, IconButton, ListItem, ListItemButton, ListItemText, List, Box, ListItemAvatar, Avatar } from "@mui/material";
import { Close } from "@mui/icons-material";
import NotificationContext from "../../context/NotificationProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { prefixBackendUrl } from "../../utils";
import { Notification as NotifType } from "../../../../comon_src/type/utils.type";

const notificationArray = {
	like: ["has liked your profile", "profile"],
	message: ["has sent you a message", "chat"],
	visit: ["has visited your profile", "profile"],
	match: ["It's a match!!", "chat"],
	unlike: ["has unliked your profile", "profile"]
};

function createNotifications(notifications: NotifType[], toggleNotification: () => void): JSX.Element {
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
						<Avatar alt={notification.fromUsername} src={prefixBackendUrl(notification.profilePicture)} />
					</ListItemAvatar>
					<ListItemText
						primary={notification.fromUsername}
						secondary={
							<>
								{msg} <br />
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
					{createNotifications(notifications, toggleNotification)}
				</List>
			</Drawer>
		</>
	);
}