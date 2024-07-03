import { Attendence } from "../types/attendence";
import { AttendenceStatus } from "../enums/attendence.enum";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface AttendenceDocument extends Document, Attendence { }

export interface AttendenceModel extends Model<AttendenceDocument> { }


const attendenceSchema = new mongoose.Schema<AttendenceDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        immutable: true
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(AttendenceStatus),
        default: AttendenceStatus.ABSENT
    }
}, {
    timestamps: true
});


const AttendenceModel = mongoose.model<AttendenceDocument, AttendenceModel>('Attendence', attendenceSchema);

export default AttendenceModel;