
export type payload = {
    id: string;
}

export type newJwt={
    refreshToken: string,
    token: string}
    |
    {error:string}