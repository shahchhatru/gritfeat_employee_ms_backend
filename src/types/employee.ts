export interface Employee {
    designation: string;
    salary: number;
    joiningDate?: string;
    skills?: string;
    user?: string;
    organizationId?: string;
}

export interface EmployeeWithUser {
    designation: string;
    salary: number;
    joiningDate?: string;
    skills?: string;
    name: string;
    email: string;
    role?: string;
    password: string;

}

export interface EmployeeWithUserObject {
    _id: string;
    name: string;
    email: string;
    user: User;
    organizationId?: string;

}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string;
    isVerified: boolean;
}