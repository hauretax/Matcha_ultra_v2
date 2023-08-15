import { HeartBroken } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import NotificationContext from "../../context/NotificationProvider";

export default function NotificationOpener({ openNotification, NotificationIsopen }: { openNotification: () => void, NotificationIsopen: boolean | undefined }) {
	const [unread, setunread] = useState<number>(0);

	const { unreadCount, setRead } = useContext(NotificationContext);

	function handleRead() {
		if (unreadCount)
			setRead();
		openNotification();
	}

	useEffect(() => {
		setunread(unreadCount);
	}, [unreadCount]);

	return (
		<>
			<IconButton
				color="inherit"
				aria-label="open drawer"
				edge="end"
				onClick={handleRead}
				sx={{ ...(NotificationIsopen && { display: "none" }) }}
			>
				{unread ? <HeartBroken className="Bolt" sx={{ color: "var(--bolt-color)" }} /> : <FavoriteIcon sx={{ color: "var(--bolt-color)" }} />}
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
							transform: scale(1.5);
							color: red;
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