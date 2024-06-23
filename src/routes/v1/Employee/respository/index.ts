import EmployeeModel, { EmployeeDocument } from "../../../../models/employee";
import { Employee } from "../../../../types/employee";

export const createEmployeeRepo = (employeeData: Employee): Promise<EmployeeDocument> => {
    const employee = new EmployeeModel(employeeData);
    return employee.save();
}


export const getAllEmployees = (): Promise<EmployeeDocument[]> => {
    return EmployeeModel.find({})
}

export const getEmployeeById = (id: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findById(id)
}

export const getEmployeeByUserId = (id: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOne({ user: id })
}

export const getEmployeeModelByUserId = (id: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOne({ user: id })
}

export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findByIdAndUpdate(id, employeeData, { new: true });
}

export const updateEmployeeByUserId = async (id: string, employeeData: Partial<Employee>): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOneAndUpdate({ user: id }, employeeData, { new: true });
}


export const deleteEmployeeById = async (id: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findByIdAndDelete(id);
}

export const deleteEmployeeByUserId = async (id: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOneAndDelete({ user: id })
}