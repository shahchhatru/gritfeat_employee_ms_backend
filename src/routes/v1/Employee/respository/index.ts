import EmployeeModel, { EmployeeDocument } from "../../../../models/employee";
import { Employee } from "../../../../types/employee";

export const createEmployeeRepo = (employeeData: Employee): Promise<EmployeeDocument> => {
    const employee = new EmployeeModel(employeeData);
    return employee.save();
}


export const getAllEmployees = async (orgId: string): Promise<EmployeeDocument[]> => {
    return EmployeeModel.find({ organizationId: orgId }).populate('user').exec();
};

export const getEmployeeById = (id: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findById(id)
}

export const getAllEmployeesByOrganization = (): Promise<EmployeeDocument[]> => {
    return EmployeeModel.find({})
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


// Add a bonus amount
export const addBonusAmount = async (employeeId: string, bonusAmount: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findByIdAndUpdate(
        employeeId,
        { $push: { bonus: parseInt(bonusAmount) } },
        { new: true }
    );
}

// Remove a specific bonus amount
export const removeBonusAmount = async (employeeId: string, bonusAmount: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findByIdAndUpdate(
        employeeId,
        { $pull: { bonus: parseInt(bonusAmount) } },
        { new: true }
    );
}

export const getTotalBonusAmount = async (employeeId: string): Promise<number> => {
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
        throw new Error("Employee not found");
    }
    if (!employee.bonus) {
        return 0;
    }
    return employee?.bonus?.reduce((total, bonus) => total + bonus, 0);
}

// Add bonus amount by user ID
export const addBonusAmountByUserId = async (userId: string, bonusAmount: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOneAndUpdate(
        { user: userId },
        { $push: { bonus: bonusAmount } },
        { new: true }
    );
}

// Remove bonus amount by user ID
export const removeBonusAmountByUserId = async (userId: string, bonusAmount: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOneAndUpdate(
        { user: userId },
        { $pull: { bonus: bonusAmount } },
        { new: true }
    );
}



// Clear bonus array by user ID
export const clearBonusArrayByUserId = async (userId: string): Promise<EmployeeDocument | null> => {
    return EmployeeModel.findOneAndUpdate(
        { user: userId },
        { $set: { bonus: [] } },
        { new: true }
    );
}
