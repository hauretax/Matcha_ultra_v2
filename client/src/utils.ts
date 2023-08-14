import { PersonalProfile } from "../../comon_src/type/user.type";
import apiProvider from "./services/apiProvider";
import { ErrorResponse } from "../../comon_src/type/error.type";

export const prefixBackendUrl = (path: string) => {
	return path ? `${process.env.REACT_APP_BACKEND_URL}/images/${path}` : "";
};

export const isProfileIncomplete = (user: PersonalProfile) => {
	return user.username === "" ||
    user.firstName === "" ||
    user.lastName === "" ||
    user.gender === "" ||
    user.birthDate === "" ||
    user.preferences.length === 0 ||
    user.interests.length === 0 ||
    user.biography === "" ||
    user.pictures.length === 0;
};

export const buildErrorString = (err: ErrorResponse, msg: string) => {
	if (err.response?.data?.error) {
		return `${msg} : ${err.response?.data?.error}`;
	}
	return msg;
};

export async function fetchLocation(printError: (err: ErrorResponse) => void) {
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			try {
				await apiProvider.updatePositionByLL(position.coords.latitude.toString(), position.coords.longitude.toString());
			} catch (err) {
				printError(err as ErrorResponse);
			}
		},
		async () => {
			try {
				await apiProvider.updatePositionByIp();
			} catch (err) {
				printError(err as ErrorResponse);
			}
		},
		{
			enableHighAccuracy: true,
		}
	);
}