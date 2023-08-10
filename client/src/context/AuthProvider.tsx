import React from "react";
import { AxiosResponse } from "axios";

import { PersonalProfile } from "../../../comon_src/type/user.type";

import fakeAuthProvider from "../services/fakeAuthProvider";
import authProvider from "../services/authProvider";

import { useSnackbar } from "./SnackBar";
import apiProvider from "../services/apiProvider";
import { ErrorResponse } from "../../../comon_src/type/error.type";

interface AuthContextType {
  user: PersonalProfile | null;
  signin: (username: string, password: string) => Promise<void>;
  signup: (email: string, username: string, firstName: string, lastName: string, password: string) => Promise<void>;
  valideByMail: (mail: string, code: string) => Promise<void>,
  resetPasswordRequest: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
  getProfile: (id: string) => Promise<void>;
  updateBio: (biography: string) => Promise<void>;
  updateInterests: (interests: string[]) => Promise<void>;
  updateProfile: (firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string, customLocation: boolean, latitude: string, longitude: string) => Promise<void>;
  insertPicture: (formdata: FormData) => Promise<void>;
  updatePicture: (formdata: FormData, pictureId: number) => Promise<void>;
  deletePicture: (pictureId: number) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<PersonalProfile | null>(null);
	const snackBar = useSnackbar();

	const handleError = (error: ErrorResponse, defaultMessage: string) => {
		let errorMessage = null;
		if (error.response?.data?.error) {
			errorMessage = error.response?.data?.error;
		}
		snackBar(`${defaultMessage} ${errorMessage ? `: ${errorMessage}` : ""}`, "error");
	};

	const signin = async (username: string, password: string): Promise<void> => {
		try {
			const res: AxiosResponse = await authProvider.signin(username, password);
			const { jwt, profile }: { jwt: { refreshToken: string, accessToken: string }, profile: PersonalProfile } = res.data;
			const { accessToken, refreshToken } = jwt;

			// Store the JWT token in local storage
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);

			// Update the user state
			setUser(profile);

			snackBar("Login successfull", "success");
		} catch (error) {
			handleError(error as ErrorResponse, "Login failed");
		}
	};

	const signup = async (username: string, email: string, firstName: string, lastName: string, password: string): Promise<void> => {
		try {
			await authProvider.signup(username, email, firstName, lastName, password);

			snackBar("Registration successful. You can now login !", "success");
		} catch (error) {
			handleError(error as ErrorResponse, "Registration failed");
		}
	};

	const resetPasswordRequest = async (email: string): Promise<void> => {
		try {
			await authProvider.resetPasswordRequest(email);
			snackBar("An email has been sent to " + email + ". Clik in the link inside to reset your password", "success");
		} catch (error) {
			handleError(error as ErrorResponse, "Request failed");
		}
	};

	const resetPassword = async (email: string, code: string, password: string): Promise<void> => {
		try {
			await authProvider.resetPassword(code, password, email);
			snackBar("Password reseted successfully", "success");
		} catch (error) {
			handleError(error as ErrorResponse, "Reset failed");
		}
	};


	const getProfile = async (id: string): Promise<void> => {
		try {
			const res: AxiosResponse = await apiProvider.getProfile(id);
			setUser(res.data);
		} catch (error) {
			handleError(error as ErrorResponse, "Error while fetching profile");
		}
	};

	const updateProfile = async (firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string, customLocation: boolean, latitude: string, longitude: string): Promise<void> => {
		try {
			await apiProvider.updateProfile(firstName, lastName, birthDate, gender, orientation, email, customLocation, latitude, longitude);

			if (user) {
				const newUser = {
					...user,
					firstName,
					lastName,
					birthDate,
					gender,
					orientation,
					email,
					emailVerified: Number(user.email === email),
					customLocation
				};
				if (customLocation) {
					newUser.latitude = latitude;
					newUser.longitude = longitude;
				}

				setUser(newUser);
			}
		} catch (error) {
			handleError(error as ErrorResponse, "Error while updating profile information");
		}
	};

	const updateBio = async (biography: string): Promise<void> => {
		try {
			await apiProvider.updateBio(biography);

			if (user) {
				const newUser = {
					...user,
					biography
				};
				setUser(newUser);
			}
		} catch (error) {
			handleError(error as ErrorResponse, "Error while updating biography");
		}
	};

	const updateInterests = async (interests: string[]): Promise<void> => {
		try {
			await apiProvider.updateInterests(interests);

			if (user) {
				const newUser = {
					...user,
					interests
				};
				setUser(newUser);
			}
		} catch (error) {
			handleError(error as ErrorResponse, "Error while updating interests");
		}
	};

	const insertPicture = async (formdata: FormData): Promise<void> => {
		try {
			const res: AxiosResponse = await apiProvider.insertPicture(formdata);
			if (user) {
				const newUser = {
					...user,
					pictures: [...user.pictures, res.data]
				};
				setUser(newUser);
			}
		} catch (error) {
			handleError(error as ErrorResponse, "Error while inserting picture");
		}
	};

	const updatePicture = async (formdata: FormData, pictureId: number): Promise<void> => {
		try {
			const res: AxiosResponse = await apiProvider.updatePicture(formdata, pictureId);
			if (user) {
				const newUser = {
					...user,
					pictures: user.pictures.map(picture => picture.id === pictureId ? res.data : picture)
				};
				setUser(newUser);
			}
		} catch (error) {
			handleError(error as ErrorResponse, "Error while updating picture");
		}
	};

	const deletePicture = async (pictureId: number): Promise<void> => {
		try {
			await apiProvider.deletePicture(pictureId);
			if (user) {
				const newUser = {
					...user,
					pictures: user.pictures.filter(picture => picture.id !== pictureId)
				};
				setUser(newUser);
			}
		} catch (error) {
			handleError(error as ErrorResponse, "Error while deconsting picture");
		}
	};

	// TODO #4
	const signout = async (): Promise<void> => {
		try {

			await fakeAuthProvider.signout();
			localStorage.removeItem("jwtToken");
			setUser(null);
			snackBar("Logout successfull", "success");
		} catch (error) {
			handleError(error as ErrorResponse, "Logout failed");
		}
	};

	const valideByMail = async (email: string, code: string): Promise<void> => {
		try {
			await authProvider.verifyEmail(code, email);
		} catch (error) {
			handleError(error as ErrorResponse, "Error while validating email");
		}
	};

	const value = { user, signin, signup, resetPasswordRequest, resetPassword, getProfile, updateProfile, updateBio, updateInterests, insertPicture, updatePicture, deletePicture, signout, valideByMail };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = (): AuthContextType => {
	const context = React.useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export { AuthProvider, useAuth };
