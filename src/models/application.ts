import mongoose, { Document, mongo, Schema } from 'mongoose';
import { ApplicationStatus, ApplicationTypes } from '../enums/application.enum';
export interface IApplication extends Document {
    text: string;
    type: string;
    supervisor: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    organization: mongoose.Types.ObjectId;
    status: string;
}

// Create a Schema corresponding to the document interface.
const applicationSchema: Schema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false,
            enum: Object.values(ApplicationTypes),
            default: ApplicationTypes.LEAVE,
        },
        supervisor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
            immutable: true
        },
        status: {
            type: String,
            required: false,
            enum: Object.values(ApplicationStatus),
            default: ApplicationStatus.PENDING
        }
    },
    {
        timestamps: true
    }
);

// Create a Model.
const ApplicationModel = mongoose.model<IApplication>('Application', applicationSchema);

export default ApplicationModel;
