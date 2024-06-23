import { Employee } from "../types/employee";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface EmployeeDocument extends Document, Employee { }

export interface EmployeeModel extends Model<EmployeeDocument> { }

const employeeSchema = new mongoose.Schema<EmployeeDocument>(
    {
        designation: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
        },
        joiningDate: {
            type: Date,
            required: false,
        },
        skillLevel: {
            type: String,
            required: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const EmployeeModel = mongoose.model<EmployeeDocument, EmployeeModel>('Employee', employeeSchema);

export default EmployeeModel;
