
import { createContext, useContext, useEffect, useState } from "react";
import { Notification } from "../../../comon_src/type/utils.type";
import { useAuth } from "./AuthProvider";
import apiProvider from "../services/apiProvider";
import SocketContext from "./SocketProvider";
import { useSnackbar } from "./SnackBar";
import { buildErrorString } from "../utils";
import { ErrorResponse } from "../../../comon_src/type/error.type";

interface NotificationProvider {
	notifications: Array<Notification>;
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
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const { notification } = useContext(SocketContext);
	const auth = useAuth();
	const snackbar = useSnackbar();

	useEffect(() => {
		async function getNotifications() {
			try {
				if (!localStorage.getItem("accessToken")) {
					return;
				}
				const data = await apiProvider.getNotifications();
				const fetchedNotifications = data.data;
				setNotifications(fetchedNotifications);
				const unreadCount = fetchedNotifications.filter((notification: Notification) => !notification.read).length;
				setUnreadCount(unreadCount);
			} catch (error) {
				snackbar(buildErrorString(error as ErrorResponse, "Error fetching notifications"), "error");
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
			snackbar(buildErrorString(error as ErrorResponse, "Error setting notifications as read"), "error");
		}
	}

	const contextValue = {
		notifications,
		unreadCount,
		setRead
	};

	return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
}