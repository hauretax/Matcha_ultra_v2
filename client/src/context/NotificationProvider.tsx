
import { createContext, useContext, useEffect, useState } from "react";
import { notification } from "../../../comon_src/type/utils.type";
import { useAuth } from "./AuthProvider";
import apiProvider from "../services/apiProvider";
import SocketContext from "./SocketProvider";

interface NotificationProvider {
	notifications: Array<notification>;
	haveUnread: boolean;
	setRead: () => void;
}

const NotificationContext = createContext<NotificationProvider>({
	notifications: [],
	haveUnread: false,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setRead: () => { }
});

export default NotificationContext;

export function NotificationtProvider({ children }: { children: React.ReactNode }) {
	const [notifications, setNotifications] = useState<notification[]>([]);
	const [haveUnread, sethaveUnread] = useState<boolean>(false);
	const { notification } = useContext(SocketContext);
	const auth = useAuth();

	useEffect(() => {
		async function getNotifications() {
			try {
				if (!localStorage.getItem("accessToken")) {
					return;
				}
				const data = await apiProvider.getNotifications();
				const fetchedNotifications = data.data;
				setNotifications(fetchedNotifications);
				const haveUnread = fetchedNotifications.some((notification: notification) => !notification.read);
				sethaveUnread(haveUnread);
			} catch (error) {
				console.error("Erreur lors de la récupération des notifications:", error);
			}
		}
		getNotifications();
	}, [auth.user]);

	useEffect(() => {
		if (!notification)
			return;
		setNotifications([notification, ...notifications]);

	}, [notification]);


	async function setRead() {
		if (!notifications)
			return;
		const updatedNotifications = notifications.map(notification => ({
			...notification,
			read: true,
		}));
		sethaveUnread(false);
		setNotifications(updatedNotifications);
		try {
			await apiProvider.setNotificationRead();
		} catch (error) {
			console.error("Erreur lors de la lecture des notifications", error);
		}
	}

	const contextValue = {
		notifications,
		haveUnread,
		setRead
	};

	return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
}