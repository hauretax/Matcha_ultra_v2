import React from "react";
import { AxiosError, AxiosResponse } from "axios";

import { ErrorPayload } from '../../../comon_src/type/error.type'
import { UserProfile } from "../../../comon_src/type/user.type";

import fakeAuthProvider from "../services/fakeAuthProvider";
import authProvider from "../services/authProvider";

import { useSnackbar } from "./SnackBar";
import apiProvider from "../services/apiProvider";

interface AuthContextType {
  user: any;
  signin: (username: string, password: string, callback: VoidFunction) => void;
  signup: (email: string, username: string, firstName: string, lastName: string, password: string, callback: VoidFunction) => void;
  resetPasswordRequest: (email: string, callback: VoidFunction) => void;
  getProfile: () => void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<UserProfile | null>(null);
  const snackBar = useSnackbar();

  let signin = (username: string, password: string, callback: VoidFunction) => {
    authProvider.signin(username, password)
      .then((res: AxiosResponse) => {
        const { jwtToken, profile }: { jwtToken: { refreshToken: string, token: string }, profile: UserProfile } = res.data;
        const { token, refreshToken } = jwtToken

        // Store the JWT token in local storage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        // Update the user state
        setUser(profile);

        snackBar("Login successfull", 'success');
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;

        // Display error message to the user
        snackBar('Login failed' + (errorMessage && (': ' + errorMessage)), 'error');
      })
  };

  let signup = (username: string, email: string, firstName: string, lastName: string, password: string, callback: VoidFunction) => {
    authProvider.signup(username, email, firstName, lastName, password)
      .then((res: AxiosResponse) => {
        snackBar('Registration successful. You can now login !', 'success');
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;
        snackBar('Registration failed' + (errorMessage ? ': ' + errorMessage : ''), 'error');
      });
  };

  let resetPasswordRequest = (email: string, callback: VoidFunction) => {
    fakeAuthProvider.resetPasswordRequest(email)
      .then((res: any) => {
        snackBar('An email has been sent to ' + email + '. Clik in the link inside to reset your password', 'success');
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;
        snackBar('Registration failed' + (errorMessage ? ': ' + errorMessage : ''), 'error');
      })
  };

  let getProfile = () => {
    apiProvider.getProfile()
      .then((res: AxiosResponse) => {
        const profile: UserProfile = res.data
        // Update the user state
        setUser(profile);
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;

        // Display error message to the user
        snackBar('Login failed' + (errorMessage && (': ' + errorMessage)), 'error');
      })
  };

  let signout = (callback: VoidFunction) => {
    fakeAuthProvider.signout()
      .then((res: any) => {
        // Store the JWT token in local storage
        localStorage.removeItem("jwtToken");
        // Update the user state
        setUser(null);

        snackBar("Logout successfull", 'success');
        callback();
      })
      .catch((error: AxiosError) => {
        const errorMessage = (error.response?.data as ErrorPayload)?.error;
        snackBar('Logout failed' + (errorMessage ? ': ' + errorMessage : ''), 'error');
      })
  };

  let value = { user, signin, signup, resetPasswordRequest, getProfile, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export { AuthProvider, useAuth }