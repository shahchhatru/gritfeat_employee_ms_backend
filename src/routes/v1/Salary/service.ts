import { Salary } from '../../../types/salary'
import { createSalary, getAllSalary, getAllSalaryByOrg, getAllSalaryByUser, getAllSalaryByUserAndMonth, getAllSalaryByUserAndYear, getAllSalaryUserYearAndMonth } from './repository'


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
        const sal = await getAllSalaryByUser(user);
        return sal;
    },

    async getAllSalaryByUserAndMonth(user: string, month: string) {
        const sal = await getAllSalaryByUserAndMonth(user, month);
        return sal;
    }

    ,

    async getAllSalaryByUserAndYear(user: string, year: string) {
        const sal = await getAllSalaryByUserAndYear(user, year);
        return sal;
    },

    async getAllSalaryUserYearAndMonth(user: string, year: string, month: string) {
        const sal = await getAllSalaryUserYearAndMonth(user, year, month);
        return sal;

    }


}


export default SalaryService;