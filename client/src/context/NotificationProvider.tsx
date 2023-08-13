
import { createContext, useEffect, useState } from "react";
import { notification } from "../../../comon_src/type/utils.type";
import { useAuth } from "./AuthProvider";

function getNotificationsTest(): Promise<{ data: { notifications: notification[] } }> {
	// Simuler la récupération de 3 notifications avec des données fictives
	const notifications: notification[] = [
		{
			id: 1,
			type: "like",
			fromId: 123,
			toId: 456,
			date: new Date(),
			read: true,
			fromUsername:"lux"
		},
		{
			id: 2,
			type: "like",
			fromId: 789,
			toId: 456,
			date: new Date(),
			read: true,
			fromUsername:"lux"
		},
		{
			id: 3,
			type: "like",
			fromId: 987,
			toId: 123,
			date: new Date(),
			read: false,
			fromUsername:"lux"
		},
	];

	return new Promise((resolve) => {
		// Simuler un délai de récupération
		setTimeout(() => {
			resolve({ data: { notifications } });
		}, 1000); // Résolution de la promesse après 1 seconde (simulation de récupération asynchrone)
	});
}


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

	const auth = useAuth();

	useEffect(() => {
		async function getNotifications() {
			const { data: { notifications: fetchedNotifications } } = await getNotificationsTest();
			const haveUnread = fetchedNotifications.some(notification => !notification.read);
			setNotifications(fetchedNotifications);
			sethaveUnread(haveUnread);
		}
		getNotifications();
	}, [auth.user]);


	function setRead() {
		const updatedNotifications = notifications.map(notification => ({
			...notification,
			read: true,
		}));
		sethaveUnread(false);
		setNotifications(updatedNotifications);
	}


	const contextValue = {
		notifications,
		haveUnread,
		setRead
	};

	return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
}