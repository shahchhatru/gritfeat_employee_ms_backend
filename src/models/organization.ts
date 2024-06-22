import mongoose, { Document, Model, Types } from "mongoose";
import bcrypt from 'bcryptjs';
import { Organization } from "../types/organizations";
import cron from 'node-cron';
import CustomError from "../utils/Error";

export const organizationPrivateFields = ['password', '__v', 'createdAt', 'updatedAt', 'verifiedAt', 'verificationExpiresAt'];

export interface OrganizationDocument extends Document, Organization {
    comparePassword(candidatePassword: string): Promise<boolean>;
    setVerified(): void;
}

export interface OrganizationModel extends Model<OrganizationDocument> {
    deleteExpiredUnverifiedOrganization(): Promise<void>;
}

const organizationSchema = new mongoose.Schema<OrganizationDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is Required'],
            unique: false,
        },
        email: {
            type: String,
            required: [true, 'Email is Required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is Required'],
            unique: false,
        },
        url: {
            type: String,
            required: false,
            unique: true,
        },
        linkedIn: {
            type: String,
            required: false,
            unique: true,
        },
        isVerified: {
            type: Boolean,
            required: false,
            default: false,
        },
        verifiedAt: {
            type: Date,
            required: false,
            default: null,
        },
        verificationExpiresAt: {
            type: Date,
            required: false,
            default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        },
        admin: {
            type: Types.ObjectId,
            ref: 'User',
            required: false,
        }
    },
    {
        timestamps: true,
    },
);

organizationSchema.pre<OrganizationDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        if (error instanceof Error) next(error);
    }
})

organizationSchema.methods.comparePassword = async function (candidatePassword: string) {
    if (!this.password) throw new CustomError('Invalid password or email', 401);
    return await bcrypt.compare(candidatePassword, this.password);

};

organizationSchema.methods.setVerified = async function () {
    this.isVerified = true;
    this.verifiedAt = new Date();
    this.verificationExpiresAt = null;
};

organizationSchema.statics.deleteExpiredUnverifiedOrganization = async function () {
    const now = new Date();
    await this.deleteMany({
        isVerified: false,
        verificationExpiresAt: { $lte: now }
    });
};

export const OrganizationModel = mongoose.model<OrganizationDocument, OrganizationModel>('Organization', organizationSchema);

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled task to delete expired unverified users...');
    await OrganizationModel.deleteExpiredUnverifiedOrganization();
});
