import { Vector } from "./utils.type";

export type UserProfile = {
  id: number;
  emailVerified: number;
  email: string;
  username: string;
  lastName: string;
  firstName: string;
  biography: string;
  gender: string;
  age: number;
  orientation: string;
  pictures: { id: number; src: string }[];
  interests: string[];
  localisation?: Vector;
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

export type FullUser = UserProfile & {
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
  profile: UserProfile;
}

//TODO modifier les import coter front