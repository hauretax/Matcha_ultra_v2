import React from "react";
import { AxiosError, AxiosResponse } from "axios";
import { message } from "antd";

import { ErrorPayload } from '../../../comon_src/type/error.type'
import { UserProfile } from "../../../comon_src/type/user.type";

import fakeAuthProvider from "../services/fakeAuthProvider";
import api from "../services/api";

interface AuthContextType {
  user: any;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signup: (email: string, username: string, firstName: string, lastName: string, password: string, callback: VoidFunction) => void;
  resetPasswordRequest: (email: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<UserProfile | null>(null);

  let signin = (username: string, password: string, callback: VoidFunction) => {
    fakeAuthProvider.signin(username, password)
      .then((res: any) => {
        console.log(res)
        const { jwtToken, profile }: {jwtToken: string, profile: UserProfile} = res.data;
        console.log(jwtToken, profile)

        // Store the JWT token in local storage
        localStorage.setItem("jwtToken", jwtToken);

        // Update the user state
        setUser(profile);

        message.success("Login successfull");
        callback();
      })
      .catch((error: AxiosError) => {
        console.log(error)
        const errorMessage = (error.response?.data as ErrorPayload)?.error;

        // Display error message to the user
        message.error('Login failed' + (errorMessage && (': ' + errorMessage)));
      })
  };

  let signup = (username: string, email: string, firstName: string, lastName: string, password: string, callback: VoidFunction) => {
    api.signup(username, email, firstName, lastName, password)
      .then((res: AxiosResponse) => {
        message.success('Registration successful. You can now login !');
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;
        message.error('Registration failed' + (errorMessage ? ': ' + errorMessage : ''));
      });
  };

  let resetPasswordRequest = (email: string, callback: VoidFunction) => {
    fakeAuthProvider.resetPasswordRequest(email)
      .then((res: any) => {
        message.success('An email has been sent to ' + email + '. Clik in the link inside to reset your password');
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;
        message.error('Registration failed' + (errorMessage ? ': ' + errorMessage : ''));
      })
  }

  let signout = (callback: VoidFunction) => {
    fakeAuthProvider.signout()
      .then((res: any) => {
        // Store the JWT token in local storage
        localStorage.removeItem("jwtToken");
        // Update the user state
        setUser(null);

        message.success("Logout successfull");
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;
        message.error('Logout failed' + (errorMessage ? ': ' + errorMessage : ''));
      })
  };

  let value = { user, signin, signup, resetPasswordRequest, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export { AuthProvider, useAuth }