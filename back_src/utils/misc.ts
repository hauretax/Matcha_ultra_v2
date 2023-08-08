import { UserProfile, userInDb } from "../../comon_src/type/user.type";

export function getDistanceInKm(lat1, lon1, lat2, lon2) {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);  // deg2rad below
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

export function getAge(birthdate: string) {
	const today = new Date();
	const birthDate = new Date(birthdate);
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

export function sanitizeUser(user: userInDb) {
	const sanitizedUser = {
		distance: Math.max(Math.floor(user.distance), 1),
		pictures: user.image_srcs.split(',').map((src, index) => ({
			src,
			id: parseInt(user.picture_ids.split(",")[index])
		})),
		interests: user.interests ? user.interests.split(",") : [],
		username: user.username,
		gender: user.gender,
		orientation: user.orientation,
		age: user.age,
		biography: user.biography,
		id: user.id
	};
	return sanitizedUser;
}
