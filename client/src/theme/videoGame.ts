import { ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
	palette: {
		primary: {
			main: "#ff33cc", // a bright, neon pink
		},
		secondary: {
			main: "#00ffff", // a vibrant, electric blue
		},
		background: {
			default: "#000000", // a classic, arcade-style black
		},
		text: {
			primary: "#ffffff", // a bright white for contrast against the dark background
		},
	},
	typography: {
		fontFamily: "\"Press Start 2P\", cursive", // a retro, pixelated font
		h1: {
			fontSize: "2.8rem",
			fontWeight: 700,
			color: "#ffffff", // matching the primary text color
		},
		h2: {
			fontSize: "2.2rem",
			fontWeight: 600,
			color: "#ffffff",
		},
		h3: {
			fontSize: "1.8rem",
			fontWeight: 500,
			color: "#ffffff",
		},
		body1: {
			fontSize: "1.2rem",
			color: "#ffffff",
		},
		body2: {
			fontSize: "1rem",
			color: "#ffffff",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "0px", // rectangular buttons for a more arcade-like touch
				},
			},
		},
	},
};

export default themeOptions;