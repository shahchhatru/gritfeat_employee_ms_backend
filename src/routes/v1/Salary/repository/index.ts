import { SalaryModel, SalaryDocument } from '../../../../models/salary';
import { Salary } from '../../../../types/salary';

export const createSalary = (salary: Salary): Promise<SalaryDocument> => {
    const sal = new SalaryModel(salary);
    return sal.save();
}


export const getAllSalary = (): Promise<SalaryDocument[]> => {
    return SalaryModel.find({}).exec();
}

export const getAllSalaryByOrg = (organization: string): Promise<SalaryDocument[]> => {
    return SalaryModel.find({ organization }).exec();
}

export const getAllSalaryByOrgAndYear = (organization: string, year: string): Promise<SalaryDocument[]> => {
    return SalaryModel.find({ organization, year }).exec();
}

export const getAllSalaryByUser = (user: string): Promise<SalaryDocument[]> => {
    return SalaryModel.find({ user }).exec();
}

export const getAllSalaryByUserAndYear = (user: string, year: string): Promise<SalaryDocument[]> => {
    return SalaryModel.find({ user, year }).exec();
}

export const getAllSalaryByUserAndMonth = (user: string, month: string): Promise<SalaryDocument[]> => {
    return SalaryModel.find({ user, month }).exec();
}

export const getAllSalaryUserYearAndMonth = (user: string, year: string, month: string): Promise<SalaryDocument[]> => {
    return SalaryModel.find({ user, year, month }).exec();
}

export const updateSalary = (id: string, data: Partial<Salary>): Promise<SalaryDocument | null> => {
    return SalaryModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export const deleteSalary = (id: string): Promise<SalaryDocument | null> => {
    return SalaryModel.findByIdAndDelete(id).exec();
}
