import { Api } from "./Api"

export type AuthUser = {
    id: number,
    name: string,
    email: string,
    token: string
}


export interface ApiSignupUser extends Api {
    user: AuthUser
}

export interface ApiSigninUser extends Api {
    user: AuthUser
}

export interface ApiVerifyAuthUser extends Api {
    user: {
        id: number,
        name: string,
        email: string
    }
}