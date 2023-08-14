export interface BaseProfile {
	id: number;
	username: string;
	lastName: string;
	firstName: string;
	biography: string;
	gender: string;
	birthDate: string;
	preferences: string[];
	pictures: { id: number; src: string }[];
	interests: string[];
	latitude: string;
	longitude: string;
}

export interface PersonalProfile extends BaseProfile {
	emailVerified: number;
	email: string;
	customLocation: boolean;
}

export interface UserProfile extends BaseProfile {
	distance: number;
	age: number;
	liked: boolean;
	connected: boolean;
	lastTime: string;
	linkStatus: string;
	fameRating: number;
	blocked: boolean;
	reported: boolean;
}
/**
 * 
 */
export type UserReqRegister = {
	email: string;
	username: string;
	lastName: string;
	firstName: string;
	password: string;
}

export type FullUser = PersonalProfile & {
	password: string;
	accessCode: string;
	id: number;
};

export type UserReqLogin = {
	username: string;
	password: string;
}

export type UserPayload = {
	jwt: {
		refreshToken: string,
		accessToken: string
	};
	profile: PersonalProfile;
}

export type userInDb1 = PersonalProfile & {
	image_srcs: string;
	picture_ids: string;
	interests: string;
	gender: Gender;
	user_note: number;
	views: number;
	likes: number;
}

export type userInDb2 = PersonalProfile & {
	image_srcs: string;
	picture_ids: string;
	interests: string;
	gender: Gender;
	user_note: number;
	views: number;
	likes: number;
	age: number;
	distance: number;
}

type Gender = "Female" | "Male" | "Other";

export type UserPublic = {
	username: string;
	biography: string;
	gender: Gender;
	age: number;
	orientation: string;
	pictures: string[];
	interests: string[];
	distance: number;
	note: number;
	userId?: number;
}
