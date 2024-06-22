export interface OTP {
    value: number;
    userId: string;
    expiresAt: Date;
}

export interface orgOTPType {
    value: number;
    orgId: string;
    expiresAt: Date;
}