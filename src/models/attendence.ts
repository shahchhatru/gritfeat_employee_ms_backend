import { Attendence } from "../types/attendence";
import { AttendenceStatus, AttendenceType } from "../enums/attendence.enum";
import mongoose, { Document, Model, Schema } from "mongoose";
import crypto from 'crypto';
import { UserModel } from './user';
import { OrganizationModel } from './organization';

import cron from 'node-cron';

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
    },
    type: {
        type: String,
        required: false,
        enum: Object.values(AttendenceType),
        default: AttendenceType.EMPLOYEE,
        immutable: true,
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


attendenceSchema.index({ user: 1, organization: 1, date: 1 }, { unique: true });




const AttendenceModel = mongoose.model<AttendenceDocument, AttendenceModel>('Attendence', attendenceSchema);

export default AttendenceModel;

// Function to generate a random token
const generateToken = (length: number): string => {
    return crypto.randomBytes(length).toString('hex');
};

// Function to find the admin of an organization
const findOrganizationAdmin = async (organizationId: string): Promise<string | null | undefined> => {
    const admin = await UserModel.findOne({ organization: organizationId, role: 'ADMIN' });
    return admin ? admin?._id?.toString() : null;
};

cron.schedule('0 9 * * *', async () => {

    try {
        // Fetch all organizations
        const organizations = await OrganizationModel.find({});

        for (const org of organizations) {
            if (org._id) {


                const adminId = await findOrganizationAdmin(org?._id?.toString());

                if (adminId) {
                    const newAttendence = new AttendenceModel({
                        user: adminId,
                        organization: org._id,
                        date: new Date(),
                        status: AttendenceStatus.ABSENT,
                        type: AttendenceType.ADMIN,
                        token: generateToken(32) // 32 bytes = 64 characters in hex
                    });

                    await newAttendence.save();
                    console.log(`Created attendance record for organization: ${org._id}`);
                } else {
                    console.log(`No admin found for organization: ${org._id}`);
                }
            }
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
}, {
    scheduled: true,
    timezone: "UTC" // Adjust timezone as needed
});

