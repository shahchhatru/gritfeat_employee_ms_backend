import mongoose, { Document } from 'mongoose';
import { Salary } from '../types/salary';
import { Month } from '../enums/month.enum';
import cron from 'node-cron';

import { OrganizationModel } from './organization';
import EmployeeModel from './employee';


export interface SalaryDocument extends Document, Salary {
}

const SalarySchema = new mongoose.Schema({
    baseAmount: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        default: 0,
        required: false
    },
    tax: {
        type: Number,
        default: 0,
        required: true
    },
    pf: {
        type: Number,
        default: 0,
        required: true
    },
    netAmount: {
        type: Number,
        default: 0,
        required: false
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true,
        enum: Object.values(Month)
    },
    year: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
}, {
    timestamps: true
});

// Add a unique index on user, month, and year fields
SalarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export const SalaryModel = mongoose.model<SalaryDocument>('Salary', SalarySchema);

// Function to get the current month as an enum value
const getCurrentMonth = (): Month => {
    const monthNames = Object.values(Month);
    return monthNames[new Date().getMonth()];
};

// Function to calculate salary components
const calculateSalary = (baseSalary: number) => {
    const tax = baseSalary * 0.1; // Assuming 10% tax
    const pf = baseSalary * 0.12; // Assuming 12% PF
    const netAmount = baseSalary - tax - pf;
    return { tax, pf, netAmount };
};

cron.schedule('0 1 * * *', async () => { // Runs daily at 1 AM
    try {
        const organizations = await OrganizationModel.find({});

        for (const org of organizations) {
            const employees = await EmployeeModel.find({ organizationId: org._id }).populate('user');

            const currentDate = new Date();
            const currentMonth = getCurrentMonth();
            const currentYear = currentDate.getFullYear().toString();

            for (const employee of employees) {

                if (employee?.joiningDate == null) {
                    continue;
                }
                const joiningDate = new Date(employee?.joiningDate?.toString());
                const oneMonthAfterJoining = new Date(joiningDate.setMonth(joiningDate.getMonth() + 1));

                if (currentDate >= oneMonthAfterJoining) {
                    // Check if a salary entry already exists for this month and year
                    if (!employee?._id) {
                        continue;
                    }
                    const existingSalary = await SalaryModel.findOne({
                        employee: employee._id?.toString(),
                        month: currentMonth,
                        year: currentYear,
                        organization: org._id
                    });

                    if (!existingSalary) {
                        const { tax, pf, netAmount } = calculateSalary(employee.salary);

                        const newSalary = new SalaryModel({
                            baseAmount: employee.salary,
                            tax,
                            pf,
                            netAmount,
                            bonus: employee.bonus?.reduce((a, b) => a + b, 0),
                            employee: employee._id.toString(),
                            month: currentMonth,
                            year: currentYear,
                            organization: org._id
                        });

                        await newSalary.save();
                        console.log(`Created salary entry for employee ${employee._id} for ${currentMonth} ${currentYear}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in salary creation cron job:', error);
    }
}, {
    scheduled: true,
    timezone: "UTC" // Adjust timezone as needed
});
