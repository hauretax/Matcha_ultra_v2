import { Bolt } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function NotificationOpener({ openNotification, NotificationIsopen }: { openNotification: () => void, NotificationIsopen: boolean | undefined }) {
	return (
		<>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				edge="end"
				onClick={openNotification}
				sx={{ ...(NotificationIsopen && { display: "none" }) }}
			>
				<Bolt className="Bolt" sx={{ color: "var(--bolt-color)" }} />
			</IconButton>
			<style>
				{`
					:root {
						--bolt-color: red; /* Couleur de base pour l'icône */
					}

					@keyframes colorChange {
						0% { 
							transform: scale(1);
							color: var(--background-color); /* Couleur initiale */
						  }
						  100% { 
							transform: scale(2);
							color: yellow;
						  }
					  }
					  
					  .Bolt {
						animation: colorChange 1s infinite alternate;
					  }

				`}
			</style>
		</>
	);
}