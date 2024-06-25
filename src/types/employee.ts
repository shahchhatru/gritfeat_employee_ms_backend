export interface Employee {
    designation: string;
    salary: number;
    joiningDate?: string;
    skills?: string;
    user?: string;
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