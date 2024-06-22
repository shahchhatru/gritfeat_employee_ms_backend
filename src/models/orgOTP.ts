import mongoose, { Document, Model } from "mongoose";
import { orgOTPType } from "../types/otp";
import cron from 'node-cron';

export interface OrgOTPDocument extends Document, orgOTPType {
}

export interface OrgOTPModel extends Model<OrgOTPDocument> {
    generateOTP(orgId: string): Promise<OrgOTPDocument>;
    verifyOTP(orgId: string, otp: number): Promise<boolean>;
}

const orgOTPSchema = new mongoose.Schema<OrgOTPDocument>(
    {
        value: {
            type: Number,
            required: true,
        },
        orgId: {
            type: String,
            ref: 'organization',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        },
    },
    {
        timestamps: true,
    }
);

orgOTPSchema.statics.generateOTP = async function (orgId: string) {
    const otpValue = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpDocument = new this({
        value: otpValue,
        orgId,
    });
    await otpDocument.save();
    return otpDocument;
};

orgOTPSchema.statics.verifyOTP = async function (orgId: string, otp: number) {
    const otpDocument = await this.findOne({ orgId, value: otp });
    if (!otpDocument) return false;

    const isExpired = otpDocument.expiresAt < new Date();
    if (isExpired) {
        await otpDocument.deleteOne();
        return false;
    }

    await otpDocument.deleteOne(); // OTP is used and should be deleted
    return true;
};

export const OrgOTPModel = mongoose.model<OrgOTPDocument, OrgOTPModel>('orgOTP', orgOTPSchema);

// Schedule a cron job to delete expired OTPs every minute
cron.schedule('0 * * * *', async () => {
    try {
        const result = await OrgOTPModel.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log(`Deleted ${result.deletedCount} expired OTPs`);
    } catch (error) {
        console.error('Error deleting expired OTPs:', error);
    }
});
