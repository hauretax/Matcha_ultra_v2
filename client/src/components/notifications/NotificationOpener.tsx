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
				<Bolt />
			</IconButton>
		</>
	);
}