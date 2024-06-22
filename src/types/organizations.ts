export interface Organization {
    name: string;
    email: string;
    password: string;
    url?: string;
    isVerified?: boolean;
    verifiedAt?: string;
    verificationExpiresAt?: string;
    linkedIn?: string;
    admin?: string;

}

export interface OrganizationOutput extends Organization {
    _id: string;
}