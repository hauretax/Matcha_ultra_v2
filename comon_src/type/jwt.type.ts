
export type datedToken = {
    token: string;
    date: Date;
}


export type validToken = {
    endDate:string;
    isValide:number;
}


export type newJwt= {
    refreshToken: string,
    token: string
}

export type possiblyNewJwt=
    newJwt
    |
    {error:string}
