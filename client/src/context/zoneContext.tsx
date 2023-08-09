import { createContext, useState } from "react";

type ZoneContextType = {
	message: string;
	someFunction: () => void;
	sayColor: (() => void) | undefined;
	makeColor: (newColor: () => void) => void;
};


const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export default ZoneContext;


export const ZoneProvider = ({ children }: { children: React.ReactNode }) => {
	const [message, setMessage] = useState("Hello, world!");
	const [sayColor, setSayColor] = useState<(() => void) | undefined>(undefined);

	const makeColor = (newColor: () => void) => {
		setSayColor(newColor);
	};

	const someFunction = () => {
		alert("heho");
		setMessage("NEW WORLD"); // Met à jour l'état 'message'
	};

	const contextValue = {
		message,
		someFunction,
		sayColor,
		makeColor
	};

	return (
		<ZoneContext.Provider value={contextValue}>
			{children}
		</ZoneContext.Provider>
	);
};

