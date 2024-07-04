import { Salary } from '../../../types/salary'
import EmployeeService from '../Employee/service';
import { createSalary, getAllSalary, getAllSalaryByOrg, getAllSalaryByEmployee, getAllSalaryByUserAndMonth, getAllSalaryByUserAndYear, getAllSalaryUserYearAndMonth } from './repository'
import CustomError from '../../../utils/Error';

const SalaryService = {
    async createSalary(salary: Salary) {
        const sal = await createSalary(salary);
        return sal;
    },

    async getallSalary() {
        const salary = await getAllSalary();
        return salary;
    },

    async getSalaryByOrg(organization: string) {
        const salary = await getAllSalaryByOrg(organization);
        return salary;

    },

    async getSalaryByUser(user: string) {
        const sal = await getAllSalaryByEmployee(user);
        return sal;
    },

    async getAllSalaryByUserAndMonth(user: string, month: string) {
        const sal = await getAllSalaryByUserAndMonth(user, month);
        return sal;
    }

    ,

    async getAllSalaryByUserAndYear(user: string, year: string) {
        const employee = await EmployeeService.getEmployeeByUserId(user);
        if (!employee) throw new CustomError('Employee not found', 404);
        if (!employee?._id) throw new CustomError('Employee not found', 404);
        const sal = await getAllSalaryByUserAndYear(user, year);
        return sal;
    },

    async getAllSalaryUserYearAndMonth(user: string, year: string, month: string) {
        const employee = await EmployeeService.getEmployeeByUserId(user);
        if (!employee) throw new CustomError('Employee not found', 404);
        if (!employee?._id) throw new CustomError('Employee not found', 404);
        const sal = await getAllSalaryUserYearAndMonth(employee?._id?.toString(), year, month);
        return sal;

    }


}


export default SalaryService;