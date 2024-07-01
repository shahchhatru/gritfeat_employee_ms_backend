import { SalaryModel, SalaryDocument } from '../../../models/salary';
import { Salary } from '../../../../types/salary';

export const createSalary = (salary: Salary): Promise<SalaryDocument> => {
    const sal = new SalaryModel(salary);
    return sal.save();
}

