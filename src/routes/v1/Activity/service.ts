import { ActivityLog } from 'types';
import {createLog, getAllActivitLogs,getAllActivitiesbyUser} from './repository';

const ActivityService={
    async createActivityLog (userId:string,userName:string,message:string){
        await createLog(userId,userName,message);
        return true;
    },

    async getAllActivitLogs():Promise<ActivityLog[]>{
        return getAllActivitLogs();
    },
    
    async getAllActivitLogsByUser(userId:string):Promise<ActivityLog[]>{
        return getAllActivitiesbyUser(userId);
    }
}




export default ActivityService;