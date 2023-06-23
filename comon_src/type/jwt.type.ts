
export type datedToken = {
    token: string;
    date: Date;
}


export type validToken = {
    endDate:string;
    isValide:number;
}


export type accessTokenList = {
    refreshToken: string,
    token: string
}
