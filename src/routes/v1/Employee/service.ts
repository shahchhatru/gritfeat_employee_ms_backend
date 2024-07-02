import CustomError from "../../../utils/Error";
import { messages } from "../../../utils/Messages";
import { Employee } from "../../../types/employee";
import {
    createEmployeeRepo, getEmployeeById, getEmployeeByUserId, getAllEmployees, updateEmployeeByUserId, deleteEmployeeByUserId, removeBonusAmount,
    clearBonusArrayByUserId, addBonusAmount,
    getTotalBonusAmount
} from './respository';


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
    async getALLEmployees(orgId: string) {
        const employees = await getAllEmployees(orgId);
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
    },
    async getTotalBonusAmountByUserId(userId: string) {
        const employee = await getEmployeeByUserId(userId);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }
        if (!employee._id) {
            throw new CustomError(messages.employee.not_found, 404);
        }

        const totalBonus = await getTotalBonusAmount(employee._id.toString());
        return totalBonus;
    },

    async addBonusAmountByUserId(userId: string, bonusAmount: string) {
        const employee = await getEmployeeByUserId(userId);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }

        const updatedEmployee = await addBonusAmount(employee?._id?.toString() || '', bonusAmount);
        if (!updatedEmployee) {
            throw new CustomError(messages.employee.bounus_update_failed, 500);
        }

        return updatedEmployee;
    },

    async removeBonusAmountByUserId(userId: string, bonusAmount: string) {
        const employee = await getEmployeeByUserId(userId);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }

        const updatedEmployee = await removeBonusAmount(employee?._id?.toString() || '', bonusAmount);
        if (!updatedEmployee) {
            throw new CustomError(messages.employee.bounus_update_failed, 500);
        }

        return updatedEmployee;
    },

    async clearBonusArrayByUserId(userId: string) {
        const employee = await getEmployeeByUserId(userId);
        if (!employee) {
            throw new CustomError(messages.employee.not_found, 404);
        }


        const updatedEmployee = await clearBonusArrayByUserId(userId);
        if (!updatedEmployee) {
            throw new CustomError(messages.employee.all_bounus_cleared, 500);
        }

        return updatedEmployee;
    }

}


export default EmployeeService;