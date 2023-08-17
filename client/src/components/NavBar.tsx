import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { prefixBackendUrl } from "../utils";
import { Badge } from "@mui/material";
import { Notifications } from "@mui/icons-material";

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
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const auth = useAuth();
	const navigate = useNavigate();

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleNavNavMenu = (url: string) => {
		handleCloseNavMenu();
		navigate(url);
	};

	const handleNavUserMenu = (url: string) => {
		handleCloseUserMenu();
		navigate(url);
	};

	const handleLogout = async () => {
		handleCloseUserMenu();
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

					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.label} onClick={() => handleNavNavMenu(page.url)}>
									<Typography component="a" textAlign="center">{page.label}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<FavoriteIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							display: { xs: "flex", md: "none" },
							flexGrow: 1,
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none",
						}}
					>
						MATCHA
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{pages.map((page) => (
							<Button
								key={page.label}
								onClick={() => handleNavNavMenu(page.url)}
								sx={{ my: 2, color: "inherit", display: "block", lineHeight: "32px" }}
							>
								{page.label}
							</Button>
						))}
					</Box>

					{auth.user ?
						<Box sx={{ flexGrow: 0 }}>
							<IconButton
								size="large"
								aria-label={`show ${count} new notifications`}
								color="inherit"
								onClick={toggleNotification}
								sx={{ mr: 2 }}
							>
								<Badge badgeContent={count} color="error">
									<Notifications />
								</Badge>
							</IconButton>
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src={prefixBackendUrl(auth.user.pictures[0]?.src)} />
							</IconButton>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem key='profile' onClick={() => handleNavUserMenu("/profile")}>
									<Typography textAlign="center">Profile</Typography>
								</MenuItem>
								<MenuItem key='account' onClick={() => handleNavUserMenu("/account")}>
									<Typography textAlign="center">Account</Typography>
								</MenuItem>
								<MenuItem key='logout' onClick={handleLogout}>
									<Typography textAlign="center">Logout</Typography>
								</MenuItem>
							</Menu>
						</Box> :
						<Button sx={{ my: 2, color: "inherit", display: "block", lineHeight: "32px" }} onClick={() => navigate("/login")} variant='outlined'>LOGIN</Button>
					}

				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default NavBar;
