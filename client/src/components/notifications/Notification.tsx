import { Divider, Drawer, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, List, Box } from "@mui/material";
import { ArrowRight, Favorite, Inbox, Mail, ThumbDown, ThumbUp, Visibility } from "@mui/icons-material";
import NotificationContext from "../../context/NotificationProvider";
import { useContext, useEffect } from "react";
import { notification, notificationType } from "../../../../comon_src/type/utils.type";

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

function createNotification(notifications: notification[]): JSX.Element {
	console.log("not:", notifications);
	const notificationListe = notifications.map((notification) => {
		return <ListItem key={notification.id} disablePadding>

			<ListItemButton>
				<ListItemIcon>
					{selectIcon(notification.type)}
				</ListItemIcon>
				<ListItemText primary={`u get ${notification.type} by ${notification.fromUsername}`} />
			</ListItemButton>
		</ListItem>;
	});
	console.log(notificationListe);
	return <>{notificationListe}</>;
}

export default function Notification({ closeNotification, NotificationIsopen }: { closeNotification: () => void, NotificationIsopen: boolean | undefined }) {
	const { notifications } = useContext(NotificationContext);
	useEffect(() => {
		console.log("je sait pas ? ", notifications);
	}, [notifications]);

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
					{createNotification(notifications)}
				</List>
			</Drawer>
		</>
	);
}