import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import { AccountCircle, Logout, Notifications } from "@mui/icons-material";

const pages = [
	{
		label: "Browse",
		url: "/"
	},
	{
		label: "Chat",
		url: "/chat"
	}
];

function NavBar({ toggleNotification, count }: { toggleNotification: () => void; count: number }) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const auth = useAuth();
	const navigate = useNavigate();

	const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleNavMenu = (url: string) => {
		handleCloseMenu();
		navigate(url);
	};

	const handleNavProfile = () => {
		navigate("/profile");
	};

	const handleLogout = async () => {
		await auth.signout();
		navigate("/");
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<FavoriteIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						MATCHA
					</Typography>

					<Box sx={{ display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorEl)}
							onClose={handleCloseMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.label} onClick={() => handleNavMenu(page.url)}>
									<Typography component="a" textAlign="center">{page.label}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<FavoriteIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1, flexGrow: 1 }} />	
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{pages.map((page) => (
							<Button
								key={page.label}
								onClick={() => handleNavMenu(page.url)}
								sx={{ my: 2, color: "inherit", display: "block", lineHeight: "32px" }}
							>
								{page.label}
							</Button>
						))}
					</Box>

					{auth.user ?
						<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexGrow: 0 }}>
							<IconButton
								size="large"
								aria-label={`show ${count} new notifications`}
								color="inherit"
								onClick={toggleNotification}
							>
								<Badge badgeContent={count} color="error">
									<Notifications />
								</Badge>
							</IconButton>
							<IconButton onClick={handleNavProfile} size="large" color="inherit">
								<AccountCircle />
							</IconButton>
							<IconButton onClick={handleLogout} size="large" color="inherit">
								<Logout />
							</IconButton>
						</Box> :
						<Button sx={{ my: 2, color: "inherit", display: "block", lineHeight: "32px" }} onClick={() => navigate("/login")} variant='outlined'>LOGIN</Button>
					}

				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default NavBar;
