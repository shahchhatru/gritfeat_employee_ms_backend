import mongoose, { Document, Schema } from "mongoose";
import { AttendenceStatus } from "enums/attendence.enum";
export interface IAttendence extends Document {
    user: string;
    organization: string;
    date: Date;
    status: string;
}
const attendenceSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(AttendenceStatus),
            default: AttendenceStatus.ABSENT
        }
    },
    {
        timestamps: true,
    }

);

const AttendenceModel = mongoose.model<IAttendence>("Attendence", attendenceSchema);
export default AttendenceModel;

