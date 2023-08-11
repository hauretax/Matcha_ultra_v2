import { Divider, Drawer, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, List, Box } from "@mui/material";
import { ArrowRight, Inbox, Mail } from "@mui/icons-material";

export default function Notification({ closeNotification, NotificationIsopen }: { closeNotification: () => void, NotificationIsopen: boolean | undefined }) {
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
					{["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>
									{index % 2 === 0 ? <Inbox /> : <Mail />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
		</>
	);
}