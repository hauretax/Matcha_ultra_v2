import { findTenUsersParams } from "../../../comon_src/type/utils.type";
import axiosPrivate from "./axiosPrivate";

const apiProvider = {
	getProfile(id: string) {
		return axiosPrivate.get("/profile/" + id);
	},

	getOptions() {
		return axiosPrivate.get("/options");
	},

	updatePositionByIp() {
		return axiosPrivate.post("/setLocationByIP");
	},

	/*
  * update position by longitude and latitude
  */
	updatePositionByLL(latitude: string, longitude: string) {
		return axiosPrivate.post("/setLocalisation", {
			latitude,
			longitude
		});
	},

	updateProfile(firstName: string, lastName: string, birthDate: string, gender: string, orientation: string, email: string, customLocation: boolean, latitude: string, longitude: string) {
		return axiosPrivate.patch("/profile", { firstName, lastName, birthDate, gender, orientation, email, customLocation, latitude, longitude });
	},

	updateBio(biography: string) {
		return axiosPrivate.patch("/profileBio", { biography });
	},

	updateInterests(interests: string[]) {
		return axiosPrivate.patch("/profileInterests", { interests });
	},

	deletePicture(id: number) {
		return axiosPrivate.delete(`/picture/${id}`);
	},

	insertPicture(formData: FormData) {
		return axiosPrivate.post("/picture/new", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	updatePicture(formData: FormData, id: number) {
		return axiosPrivate.put(`/picture/${id}/edit`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	noteUsers({ note, userTo }: { note: number, userTo: number }) {
		return axiosPrivate.post("/note/userTo", { note, userTo });
	},

	/*
  *age|birthdate
  *localisation : latitude, longitude
  * interests array
  * genderFind array
  */
	getUsers({ latitude, longitude, distanceMax, ageMin, ageMax, orientation, interestWanted, index, orderBy }: findTenUsersParams) {
		return axiosPrivate.get(`/users?latitude=${latitude}
    &longitude=${longitude}
    &distanceMax=${distanceMax}
    &ageMin=${ageMin}
    &ageMax=${ageMax}
    &orientation=${encodeURIComponent(orientation.toString())}
    &interestWanted=${encodeURIComponent(interestWanted.toString())}
    &index=${index}
    &orderBy=${orderBy}`);

	},

	like(likeeId: number, status: boolean) {
		return axiosPrivate.post("/like", { likeeId, status });
	}
};

export default apiProvider;