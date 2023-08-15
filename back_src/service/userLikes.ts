import FindDb from "../database/Find.db";
import { getAge, getDistance } from "../utils/misc";

export async function getProfileLikes(id: number, longitude: number, latitude: number) {
	const profileLikes = await FindDb.getProfileLikes(id);
	return Promise.all(profileLikes.map(async (user) => {
		user.interests = user.interest_list ? user.interest_list.split(",") : [];
		user.pictures = user.picture_ids ? user.picture_ids.split(",").map((id: string, idx: number) => {
			return { id: parseInt(id), src: user.picture_srcs.split(",")[idx] };
		}) : [];
		user.age = getAge(user.birthDate);
		user.distance = getDistance(longitude, latitude, user.longitude, user.latitude);
		user.liked = await FindDb.isLikedBy(id, user.id);
		return user;
	}));
}