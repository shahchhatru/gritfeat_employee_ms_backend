import mongoose, { Document } from 'mongoose';
import { Salary } from '../types/salary';
import { Month } from '../enums/month.enum';

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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

export const SalaryModel = mongoose.model<SalaryDocument>('Salary', SalarySchema)

