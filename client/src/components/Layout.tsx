import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Copyright from "./Copywright";
import { useContext, useState } from "react";
import Notification from "./notifications/Notification";
import NotificationContext from "../context/NotificationProvider";


function Layout() {
	const [open, setOpen] = useState<boolean>(false);
	const notification = useContext(NotificationContext);

	const toggleNotification = () => {
		if (!open)
			setTimeout(() => { notification.setRead(); }, 5000);
		setOpen(!open);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<NavBar toggleNotification={toggleNotification} count={notification.unreadCount} />
			<Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column" }}>
				<Container maxWidth="lg" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
					<Outlet />
				</Container>
			</Box>
			<Box component="footer" sx={{ p: 2, mt: "auto", backgroundColor: "lightgray" }}>
				<Container maxWidth="lg">
					<Copyright />
				</Container>
			</Box>
			<Notification toggleNotification={toggleNotification} open={open} />
		</Box>
	);
}

export default Layout;