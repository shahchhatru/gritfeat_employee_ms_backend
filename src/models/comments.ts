import mongoose , {Document, Schema} from 'mongoose';
import { Comment } from '../types';

export interface CommentDocument extends Document, Comment{

}

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:'Task',
        required:true
    }
},{
    timestamps:true
});

export const CommentModel = mongoose.model<CommentDocument>('Comment',commentSchema)