
import { createContext, useContext, useEffect, useState } from "react";
import { notification } from "../../../comon_src/type/utils.type";
import { useAuth } from "./AuthProvider";
import apiProvider from "../services/apiProvider";
import SocketContext from "./SocketProvider";

interface NotificationProvider {
	notifications: Array<notification>;
	unreadCount: number;
	setRead: () => void;
}

const NotificationContext = createContext<NotificationProvider>({
	notifications: [],
	unreadCount: 0,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setRead: () => { }
});

export default NotificationContext;

export function NotificationtProvider({ children }: { children: React.ReactNode }) {
	const [notifications, setNotifications] = useState<notification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
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
				const unreadCount = fetchedNotifications.filter((notification: notification) => !notification.read).length;
				setUnreadCount(unreadCount);
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
		setUnreadCount(unreadCount + 1);
	}, [notification]);


	async function setRead() {
		if (!notifications)
			return;
		const updatedNotifications = notifications.map(notification => ({
			...notification,
			read: true,
		}));
		setUnreadCount(0);
		setNotifications(updatedNotifications);
		try {
			await apiProvider.setNotificationRead();
		} catch (error) {
			console.error("Erreur lors de la lecture des notifications", error);
		}
	}

	const contextValue = {
		notifications,
		unreadCount,
		setRead
	};

	return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
}