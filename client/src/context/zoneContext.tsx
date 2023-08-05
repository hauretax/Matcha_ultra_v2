import { createContext, useState } from "react";

type ZoneContextType = {
  message: string;
  someFunction: () => void;
  sayColor:Function;
  makeColor: Function;
};


const ZoneContext = createContext<ZoneContextType>(null!);

export default ZoneContext;


export const ZoneProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState("Hello, world!");
    const [sayColor, setSayColor] = useState<Function>(() => { });

    const makeColor= (newColor:Function) => {
        setSayColor(newColor)
    }

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
  
