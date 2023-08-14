import { Divider, Drawer, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, List, Box } from "@mui/material";
import { ArrowRight, Favorite, Mail, ThumbDown, ThumbUp, Visibility } from "@mui/icons-material";
import NotificationContext from "../../context/NotificationProvider";
import { useCallback, useContext } from "react";
import { notification, notificationType } from "../../../../comon_src/type/utils.type";
import { useNavigate } from "react-router-dom";

function selectIcon(type: notificationType) {
	switch (type) {
	case "like":
		return <ThumbUp />;
	case "message":
		return <Mail />;
	case "visit":
		return <Visibility />;
	case "match":
		return <Favorite />;
	case "unlike":
		return <ThumbDown />;
	default:
		return <span>?</span>;
	}
}

function createNotifications(notifications: notification[]): JSX.Element {
	const navigate = useNavigate();

	function navTo(id: number, type: notificationType) {
		switch (type) {
		case "message":
			navigate(`/chat/${id}`);
			return;
		default:
			navigate(`/profile/${id}`);
			return;
		}
	}
	if (!notifications) {
		return <></>;
	}
	const notificationListe = notifications.map((notification) => {
		return (
			<ListItem key={notification.id} onClick={() => navTo(notification.fromId, notification.type)} disablePadding sx={{ my: 1 }} className={!notification.read ? "unread" : ""}>
				<ListItemButton>
					<ListItemIcon>
						{selectIcon(notification.type)}
					</ListItemIcon>
					<ListItemText primary={`u get ${notification.type} by ${notification.fromUsername}`} />
				</ListItemButton>
				<style>
					{`
						@keyframes blink {
							0% {
								background-color: pink;
							}
							100% {
								background-color: red;
							}
						}
						.unread {
							animation: blink 1s infinite alternate;
						}
        			`}
				</style>
			</ListItem>
		);
	});
	return <>{notificationListe}</>;
}

export default function Notification({ closeNotification, NotificationIsopen }: { closeNotification: () => void, NotificationIsopen: boolean | undefined }) {
	const { notifications } = useContext(NotificationContext);

	return (
		<>
			<Drawer
				sx={{
					width: "200px",
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: "200px",
					},
				}}
				variant="persistent"
				anchor="right"
				open={NotificationIsopen}
			>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<IconButton onClick={closeNotification}>
						{<ArrowRight />}
					</IconButton>
				</Box>
				<Divider />
				<List>
					{createNotifications(notifications)}
				</List>
			</Drawer>
		</>
	);
}