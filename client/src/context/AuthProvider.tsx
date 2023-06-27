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
  signin: (username: string, password: string, callback: VoidFunction) => Promise<void>;
  signup: (email: string, username: string, firstName: string, lastName: string, password: string, callback: VoidFunction) => Promise<void>;
  valideByMail: (mail: string, code: string) => Promise<void>,
  resetPasswordRequest: (email: string, callback: VoidFunction) => void;
  getProfile: () => void;
  updateBio: (biography: string) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  updateProfile: (firstName: string, lastName: string, age: number, gender: string, orientation: string, email: string) => Promise<void>;
  insertPicture: (formdata: FormData) => Promise<void>;
  deletePicture: (pictureId: number) => Promise<void>;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<UserProfile | null>(null);
  const snackBar = useSnackbar();

  const handleError = (error: any, defaultMessage: string) => {
    let errorMessage = null;
    if (error.response?.data?.error) {
      errorMessage = error.response?.data?.error;
    }
    snackBar(`${defaultMessage} ${errorMessage ? `: ${errorMessage}` : ''}`, 'error');
  };

  const signin = async (username: string, password: string, callback: VoidFunction) => {
    try {
      const res: AxiosResponse = await authProvider.signin(username, password);
      const { jwtToken, profile }: { jwtToken: { refreshToken: string, token: string }, profile: UserProfile } = res.data;
      const { token, refreshToken } = jwtToken

      // Store the JWT token in local storage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Update the user state
      setUser(profile);

      snackBar("Login successfull", 'success');
      callback();
    } catch (error: any) {
      handleError(error, 'Login failed')
    }
  };

  const signup = async (username: string, email: string, firstName: string, lastName: string, password: string, callback: VoidFunction) => {
    try {
      await authProvider.signup(username, email, firstName, lastName, password)

      snackBar('Registration successful. You can now login !', 'success');
      callback();
    } catch (error: any) {
      handleError(error, 'Registration failed')
    }
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

  const getProfile = async () => {
    try {
      const res: AxiosResponse = await apiProvider.getProfile()
      setUser(res.data);
    } catch (error: any) {
      handleError(error, 'Error while fetching profile')
    }
  };

  const updateProfile = async (firstName: string, lastName: string, age: number, gender: string, orientation: string, email: string): Promise<void> => {
    try {
      await apiProvider.updateProfile(firstName, lastName, age, gender, orientation, email)

      if (user) {
        const newUser = {
          ...user,
          firstName,
          lastName,
          age,
          gender,
          orientation,
          email,
          emailVerified: Number(user.email === email)
        }
        setUser(newUser);
      }
    } catch (error: any) {
      handleError(error, 'Error while updating profile information');
    }
  }

  const updateBio = async (biography: string): Promise<void> => {
    try {
      await apiProvider.updateBio(biography)

      if (user) {
        const newUser = {
          ...user,
          biography
        }
        setUser(newUser);
      }
    } catch (error: any) {
      handleError(error, 'Error while updating biography');
    }
  }

  const updateInterests = async (interests: string[]): Promise<void> => {
    try {
      await apiProvider.updateInterests(interests)

      if (user) {
        const newUser = {
          ...user,
          interests
        }
        setUser(newUser);
      }
    } catch (error: any) {
      handleError(error, 'Error while updating interests');
    }
  }

  const insertPicture = async (formdata: FormData): Promise<void> => {
    try {
      const res: AxiosResponse = await apiProvider.insertPicture(formdata)
      if (user) {
        const newUser = {
          ...user,
          pictures: [...user.pictures, res.data]
        }
        setUser(newUser);
      }
    } catch (error: any) {
      handleError(error, 'Error while inserting picture');
    }
  }

  const deletePicture = async (pictureId: number): Promise<void> => {
    try {
      await apiProvider.deletePicture(pictureId)
      if (user) {
        const newUser = {
          ...user,
          pictures: user.pictures.filter(picture => picture.id !== pictureId)
        }
        setUser(newUser);
      }
    } catch (error: any) {
      handleError(error, 'Error while deleting picture');
    }
  }

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

  let valideByMail = async (email: string, code: string) => {
    try {
      await authProvider.verifyEmail(code, email)
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorPayload)?.error;
      snackBar('validation by mail failed' + (errorMessage ? ': ' + errorMessage : ''), 'error');
    }
  }

  let value = { user, signin, signup, resetPasswordRequest, getProfile, updateProfile, updateBio, updateInterests, insertPicture, deletePicture, signout, valideByMail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

export { AuthProvider, useAuth }
