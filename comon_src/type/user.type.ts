export type UserProfile = {
    email: string;
    username: string;
    lastName: string;
    firstName: string;
    emailVerified: number;
    id?: number;
    gender?: string;
    age?: number;
    sexualPreferences?: string;
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
    jwtToken: {
        refreshToken: string,
        token: string
    };
    profile: UserProfile;
}

//TODO modifier les import coter front