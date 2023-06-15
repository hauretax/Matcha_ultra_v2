
export type payload = {
    user: string;
}

export type UserProfile = {
    username: string;
    email: string;
    emailVerified: boolean;
}

export type UserPayload = {
    jwtToken: string;
    profile: UserProfile;
}