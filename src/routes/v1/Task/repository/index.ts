import Task, { ITask } from '../../../../models/task';
import { Task as T } from '../../../../types/task'
import mongoose from 'mongoose';



export const createTask = (task: T): Promise<ITask> => {
    console.log({ task });
    const { dueDate, assigner, assignees, ...restData } = task
    const newtaskdata: Partial<ITask> = {
        ...restData,
        dueDate: new Date(task.dueDate),
        assigner: new mongoose.Types.ObjectId(assigner),
        //assignees: assignees?.map(id => new mongoose.Types.ObjectId(id))
        assignees: assignees,

    }
    console.log(newtaskdata);
    const taskd = new Task(newtaskdata);
    console.log({ tasfSave: taskd });
    return taskd.save();
}


// Update an existing task
export const updateTask = (id: string, data: Partial<T>): Promise<ITask | null> => {
    return Task.findByIdAndUpdate(id, data, { new: true }).exec();
};

//Delete a task
export const deleteTask = (id: string): Promise<ITask | null> => {
    return Task.findByIdAndDelete(id).exec();
};


export const deleteTasks = (ids: string[]): Promise<{ deletedCount?: number }> => {
    return Task.deleteMany({ _id: { $in: ids } }).exec();
};

// Get a task by ID
export const getTaskById = (id: string): Promise<ITask | null> => {
    return Task.findById(id).exec();
};


const toObjectId = (id: string) => {
    return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
}

export const getTasksByUserId = async (userId: string): Promise<ITask[]> => {
    const objectId = toObjectId(userId);
    //const objectId=userId;
    if (!objectId) {
        throw new Error(`Invalid ObjectId: ${objectId}`);
    }

    // Log to debug if the correct ObjectId is being used
    console.log(`Searching tasks for userId: ${userId}, ObjectId: ${objectId}`);

    const tasks = Task.find({
        $or: [
            { assigner: objectId },
            { assignees: objectId },
        ]
    }).populate('assigner', '_id name') // Populate assigner field with id and name
        .populate('assignees', '_id name') // Populate assignees field with id and name
        .exec();

    return tasks;
};

// Get all tasks
export const getAllTasks = (): Promise<ITask[]> => {
    return Task.find().exec();
};

export const getAllTasksWithPopulatedAssignees = (): Promise<ITask[]> => {
    return Task.find()
        .populate('assigner', '_id name') // Populate assigner field with id and name
        .populate('assignees', '_id name') // Populate assignees field with id and name
        .exec();
};


export const deleteTaskByAssigner = async (id: string, userId: string): Promise<ITask | null> => {
    const task = await getTaskById(id);
    if (!task) {
        throw new Error(`Task with ID ${id} not found`);
    }

    if (task.assigner.toString() !== userId) {
        throw new Error('You are not authorized to delete this task');
    }

    return Task.findByIdAndDelete(id).exec();
};

export const updateTaskState = async (id: string,userId:string, stage: string): Promise<ITask | null> => {
    const task = await getTaskById(id);
    if (!task) {
        throw new Error(`Task with ID ${id} not found`);
    }
   

    if (task.assigner.toString() == userId || task.assignees?.includes(userId)) {
        console.log({stage})
        // const newtask ={...task._doc, stage:stage }
        // console.log(newtask)
        return Task.findByIdAndUpdate(id, {stage:stage }, { new: true }).exec();
    }

   throw new Error('You are not authorized to update this task');


}
