import { TaskPriority, TaskStage } from '../enums/task.enum';
import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    dueDate: Date;
    description?: string;
    dueTime?: string;
    assigner: mongoose.Types.ObjectId;
    assignees?: string[];
    priority?: string;
    tags?: string[];
    stage?: string;
}

// Create a Schema corresponding to the document interface.
const taskSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        dueTime: {
            type: String,
            required: false
        },
        assigner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignees: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        }],
        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            required: false,
            default: TaskPriority.LOW,
        },
        stage: {
            type: String,
            enum: Object.values(TaskStage),
            required: false,
            default: TaskStage.TODO
        },
        tags: [
            {
                type: String,
                required: false,
            }
        ]
    },
    {
        timestamps: true
    }
);


// Create a Model.
const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
