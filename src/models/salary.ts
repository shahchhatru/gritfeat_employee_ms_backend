import mongoose, { Document, Schema } from 'mongoose';
import { Salary } from '../types/salary';

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
    }
}, {
    timestamps: true
});

export const SalaryModel = mongoose.model<SalaryDocument>('Salary', SalarySchema)

