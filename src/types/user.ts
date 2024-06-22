export interface User {
    name: string;
    email: string;
    password: string;
    role?: string;
    isVerified?: boolean;
    verifiedAt?: string;
    verificationExpiresAt?: string;
    organizationId?: string;
}

