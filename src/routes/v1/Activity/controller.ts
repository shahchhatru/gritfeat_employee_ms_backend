import { successResponse } from "../../../utils/HttpResponse";
import { Response, Request, NextFunction } from 'express';
import ActivityService from "./service";
import { messages } from "../../../utils/Messages";
const ActivityController ={

    async fetchActivities(req: Request, res: Response, next: NextFunction) {
       
        try{
            const user= res.locals.user;
            if(user.role==='ADMIN'){
                const activities = await ActivityService.getAllActivitLogs()
                return successResponse({
                    response: res,
                    message: messages.task.all_get_success,
                    data: activities,
                    status: 200
                })
            }
            else{
                const activities = await ActivityService.getAllActivitLogsByUser(user._id)
                return successResponse({
                    response: res,
                    message: messages.task.all_get_success,
                    data: activities,
                    status: 200
                })
            }

        }catch(error){
            next(error);
        }
    }
    ,



}


export default ActivityController;