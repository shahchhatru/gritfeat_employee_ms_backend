import mongoose, { Model, Types, Document } from "mongoose";
import bcrypt from 'bcryptjs';
import { UserRoles } from "../enums/user-roles.enum";
import CustomError from "../utils/Error";
import { User } from "../types/user";
import cron from 'node-cron';
import ProfileModel from './profile'
export const userPrivateFields = ['password', '__v', 'createdAt', 'updatedAt', 'verifiedAt', 'verificationExpiresAt'];

export interface UserDocument extends Document, User {
    comparePassword(candidatePassword: string): Promise<boolean>;
    setVerified(): void;
}

export interface UserModel extends Model<UserDocument> {
    deleteExpiredUnverifiedUsers(): Promise<void>;
}

const userSchema = new mongoose.Schema<UserDocument>(
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
        role: {
            type: String,
            required: false,
            enum: Object.values(UserRoles),
            default: UserRoles.USER,
        },
        organizationId: {
            type: Types.ObjectId,
            ref: 'Organization',
            required: false
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
    },
    {
        timestamps: true,
    },
);

userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        if (err instanceof Error) next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    if (!this.password) throw new CustomError('Invalid password or email', 401);
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.setVerified = function () {
    this.isVerified = true;
    this.verifiedAt = new Date();
    this.verificationExpiresAt = null;
};

userSchema.statics.deleteExpiredUnverifiedUsers = async function () {
    const now = new Date();
    await this.deleteMany({
        isVerified: false,
        verificationExpiresAt: { $lte: now }
    });
};

userSchema.pre('findOneAndDelete', async function (next) {
    try {
        const doc = await this.model.findOne(this.getFilter());
        if (doc) {
            await ProfileModel.deleteOne({ user: doc._id });
        }
        next();
    } catch (err: any) {
        next(err);
    }
});

export const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled task to delete expired unverified users...');
    await UserModel.deleteExpiredUnverifiedUsers();
});
