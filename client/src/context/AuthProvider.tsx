import React from "react";

import { message } from "antd";

import { fakeAuthProvider } from "../services/fakeAuthProvider";

interface AuthContextType {
    user: any;
    signin: (username: string, password: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
    // signup: (email: string, username: string, lastName: string, firstName: string, password: string) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    let signin = (username: string, password: string, callback: VoidFunction) => {
        try {
            const response = fakeAuthProvider.signin(username, password, () => {
                message.success("Login successfull");
                callback();
            });
            const { jwtToken, profile } = response.data;

            // Store the JWT token in local storage
            localStorage.setItem("jwtToken", jwtToken);

            // Update the user state
            setUser(profile);
        } catch (error: any) {
            const errorMessage = error.message || "Login failed";

            // Display error message to the user
            message.error(errorMessage);
        }
    };

    let signout = (callback: VoidFunction) => {
        try {
            fakeAuthProvider.signout(() => {
                message.success("Logout successfull");
                callback();
            });

            // Store the JWT token in local storage
            localStorage.removeItem("jwtToken");

            // Update the user state
            setUser(null);
        } catch (error: any) {
            const errorMessage = error.message || "Logout failed";

            // Display error message to the user
            message.error(errorMessage);
        }
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    return React.useContext(AuthContext);
}

export { AuthProvider, useAuth }