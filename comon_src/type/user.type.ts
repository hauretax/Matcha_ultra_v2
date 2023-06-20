export type UserProfile = {
    email: string;
    username: string;
    lastName: string;
    firstName: string;
    //emailVerified est envoyer pour le front mais une deuxiemme verificaiton coter back peu valoir le coups
    emailVerified: boolean;
    gender?: string;
    age?: number;
    sexualPreferences?: string;
    profilePicture?: string;
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
    jwtToken: string;
    profile: UserProfile;
}

//TODO modifier les import coter front