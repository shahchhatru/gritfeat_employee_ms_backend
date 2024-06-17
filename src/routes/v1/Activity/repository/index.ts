import { ActivityLog } from "types";
import Activity from "../../../../models/activity";


export const createLog = (userId:string,userName:string,message:string)=>{
    const log = new Activity({
        userId,
        userName,
        message
    })
    log.save();
    console.log({log})

}


export const getAllActivitLogs =():Promise<ActivityLog[]>=>{
    return Activity.find().sort({ createdAt: -1 }).exec();
};


export const getAllActivitiesbyUser = (userId:string):Promise<ActivityLog[]>=>{
    return Activity.find({ userId }).sort({ createdAt: -1 }).exec();
}


