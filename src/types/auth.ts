export interface Auth {
    email:string;
    password:string;

}

export interface AuthRefresh {
    token:string;
}

export interface RefreshTokenPayloadType{
    userId:string;
    iat:number;
    exp:number;
}

export interface PasswordReset {
    token: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}