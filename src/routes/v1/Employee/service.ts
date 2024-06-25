import CustomError from "../../../utils/Error";
import { messages } from "../../../utils/Messages";
import { Employee } from "../../../types/employee";
import { createEmployeeRepo, getEmployeeById, getEmployeeByUserId, getAllEmployees, updateEmployeeByUserId, deleteEmployeeByUserId } from './respository';


const EmployeeService = {
    async createEmployee(employeeData: Employee) {
        const employee = await createEmployeeRepo(employeeData);
        if (!employee) {
            throw new CustomError(messages.employee.creation_failed, 403);
        }
        return employee;
    },



    async getEmployeeById(id: string) {
        const employee = await getEmployeeById(id);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }
        return employee;
    },
    async getEmployeeByUserId(id: string) {
        const employee = await getEmployeeByUserId(id);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }
        return employee;
    },
    async getALLEmployees() {
        const employees = await getAllEmployees();
        if (!employees) {
            throw new CustomError(messages.employee.not_found, 404);
        }
        return employees;
    },

    async updateEmployeeByUserId(id: string, data: Partial<Employee>) {
        const employee = await updateEmployeeByUserId(id, data);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }
        return employee;
    },

    async deleteEmployeeByUserId(id: string) {
        const employee = await deleteEmployeeByUserId(id);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }
        return employee;
    }
}


export default EmployeeService;