import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MyLink from "../components/MyLink";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


function LoginPage() {
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();

	const from = location.state?.from?.pathname || "/";

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const username = formData.get("username") as string;
		const password = formData.get("password") as string;

		await auth.signin(username, password);
		// Send them back to the page they tried to visit when they were
		// redirected to the login page. Use { replace: true } so we don"t create
		// another entry in the history stack for the login page.  This means that
		// when they get to the protected page and click the back button, they
		// won"t end up back on the login page, which is also really nice for the
		// user experience.
		navigate(from, { replace: true });
	}

	if (auth.user !== null) {
		return <Navigate to="/profile" />;
	}

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
					<LockIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="username"
						label="Username"
						name="username"
						autoComplete="username"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type={showPassword ? "text" : "password"}
						id="password"
						autoComplete="current-password"
						InputProps={{
							endAdornment:
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										// onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
						}}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<MyLink to="/reset_password_request" variant="body2">
								Forgot password?
							</MyLink>
						</Grid>
						<Grid item>
							<MyLink to="/register" variant="body2">
								Don't have an account? Sign Up
							</MyLink>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}

export default LoginPage;