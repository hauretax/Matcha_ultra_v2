import { userParams } from "../../../comon_src/type/utils.type";
import axiosPrivate from "./axiosPrivate";

const apiProvider = {
	getProfileLikes() {
		return axiosPrivate.get("/profile/likes");
	},

	getProfileVisits() {
		return axiosPrivate.get("/profile/visits");
	},

	getMyProfile() {
		return axiosPrivate.get("/profile");
	},

	getProfile(id: string) {
		return axiosPrivate.get("/profile/" + id);
	},

	getConversations() {
		return axiosPrivate.get("/chat/getConv");
	},

	getRelation(toId: number) {
		return axiosPrivate.post("/user/relation", { toId });
	},

	getNotifications() {
		return axiosPrivate.get("/getnotification");
	},

	getChat(id: number) {
		return axiosPrivate.get("/chat/getChat/" + id);
	},


	getOptions() {
		return axiosPrivate.get("/options");
	},

	setNotificationRead() {
		return axiosPrivate.post("/seeNotification");
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

	updateProfile(firstName: string, lastName: string, birthDate: string, gender: string, preferences: string[], email: string, customLocation: boolean, latitude: string, longitude: string) {
		return axiosPrivate.patch("/profile", { firstName, lastName, birthDate, gender, preferences, email, customLocation, latitude, longitude });
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


	insertMessage(data: { message: string, idFrom: number, idTo: number }) {
		return axiosPrivate.post("/chat/new", data);
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

	getUsers({ distanceMax, ageMin, ageMax, fameMin, fameMax, interestWanted, index, orderBy }: userParams) {
		return axiosPrivate.get(`/users?
			distanceMax=${distanceMax}
    		&ageMin=${ageMin}
    		&ageMax=${ageMax}
    		&fameMin=${fameMin}
    		&fameMax=${fameMax}
    		&interestWanted=${encodeURIComponent(interestWanted.toString())}
    		&index=${index}
    		&orderBy=${orderBy}`
		);

	},

	like(likeeId: number, status: boolean) {
		return axiosPrivate.post("/like", { likeeId, status });
	},

	block(toId: number, status: boolean) {
		return axiosPrivate.post("/block", { toId, status });
	},

	report(toId: number) {
		return axiosPrivate.post("/report", { toId });
	},

	visit(viewedId: number) {
		return axiosPrivate.post("/view", { viewedId });
	}
};

export default apiProvider;