// models/otp.model.ts
import mongoose, { Document, Model } from "mongoose";
import { OTP } from "../types/otp";

export interface OTPDocument extends Document, OTP {}

export interface OTPModel extends Model<OTPDocument> {
    generateOTP(userId: string): Promise<OTPDocument>;
    verifyOTP(userId: string, otp: number): Promise<boolean>;
}

const otpSchema = new mongoose.Schema<OTPDocument>(
    {
        value: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            ref: 'user',
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

otpSchema.statics.generateOTP = async function (userId: string) {
    const otpValue = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpDocument = new this({
        value: otpValue,
        userId,
    });
    await otpDocument.save();
    return otpDocument;
};

otpSchema.statics.verifyOTP = async function (userId: string, otp: number) {
    const otpDocument = await this.findOne({ userId, value: otp });
    if (!otpDocument) return false;

    const isExpired = otpDocument.expiresAt < new Date();
    if (isExpired) {
        await otpDocument.deleteOne();
        return false;
    }

    await otpDocument.deleteOne(); // OTP is used and should be deleted
    return true;
};

export const OTPModel = mongoose.model<OTPDocument, OTPModel>('otp', otpSchema);
