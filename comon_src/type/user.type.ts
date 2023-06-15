export type UserProfile= {
    email: string;
    userName: string;
    lastName: string;
    firstName: string;
    //verified est envoyer pour le front mais une deuxiemme verificaiton coter back peu valoir le coups
    verified: boolean;
    gender?: string;
    age?: number;
    sexualPreferences?: string;
}
//TODO il y a sans doute une fasson de liee ces deux types ↑↓
export type UserReqRegister = {
    email: string;
    userName: string;
    lastName: string;
    firstName: string;
    password: string;
}

export type FullUser = UserProfile & {
    password: string;
    accessCode: number;
    id: number;
  };

export type UserReqLogin = {
    email?: string;
    userName?: string;
    password: string;
} & (
        { email: string; userName?: never } |
        { email?: never; userName: string }|
        { email?: string; userName: string }
    );



export type UserPayload = {
    jwtToken: string;
    profile: UserProfile;
}

//TODO modifier les import coter front