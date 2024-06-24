import mongoose, { Document, Schema } from 'mongoose';
import { Comment } from '../types';

export interface CommentDocument extends Document, Comment {

}

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true,
    },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
        immutable: true,
    }
}, {
    timestamps: true
});

export const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema)