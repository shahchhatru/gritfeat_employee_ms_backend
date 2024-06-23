import mongoose, { Model, Document, Types } from "mongoose";
import { Profile } from "../types/profile";

export interface ProfileDocument extends Document, Profile {
}

export interface ProfileModel extends Model<ProfileDocument> {
}

const ProfileSchema = new mongoose.Schema<ProfileDocument>(
    {
        firstname: {
            type: String,
            required: false,
        },
        lastname: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        zip: {
            type: String,
            required: false,
        },
        says: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        }
    },
)


export const ProfileModel = mongoose.model<ProfileDocument, ProfileModel>('profile', ProfileSchema)

