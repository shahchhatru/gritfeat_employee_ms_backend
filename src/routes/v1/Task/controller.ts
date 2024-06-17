import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import TaskService from './service';

import { Task } from '../../../types';
import ActivityService from '../Activity/service';





const TaskController = {
    async createTask(req: Request<unknown, unknown, Task>, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const user = res.locals.user;
            console.log({ user })
           
                const result = await TaskService.createTask({...body,assigner:user._id})
                 
                await ActivityService.createActivityLog(user._id,user.name,messages.task.creation_success);
                return successResponse({
                    response: res,
                    message: messages.task.creation_success,
                    data: result,
                    status: 201,
                }


                )
            

          
        }
        catch (error) {
            next(error)
        }
    }
    ,

    async fetchTasks(req: Request, res: Response, next: NextFunction) {

        const tasks = await TaskService.getAllTasks();
        //const userId = res.locals.user._id;
        //const username= res.locals.user.name;
        //await ActivityService.createActivityLog(userId,username, messages.task.all_get_success);
        return successResponse({
            response: res,
            message: messages.task.all_get_success,
            data: tasks,
            status: 200
        })

    },


    async getTaskById(req: Request, res: Response, next: NextFunction) {   
        const { id } = req.params;
        const task = await TaskService.getTaskById(id);
       // const userId = res.locals.user._id;
        //const userName = res.locals.user.name;
        // await ActivityService.createActivityLog(userId,userName,'TaskID'+id+ messages.task.one_get_success);
        return successResponse({
            response: res,
            message: messages.task.one_get_success,
            data: task,
            status: 200
        })
    }
    ,

    async updateTasks(req: Request, res: Response, next: NextFunction) {

        try {
            const body = req.body;
            const { id } = req.params;
            const user = res.locals.user;
            const tasks = await TaskService.updateTask(id, user._id, body)
            await ActivityService.createActivityLog(user._id,user.name,'Task title' +tasks.title+messages.task.edit_success);
            return successResponse({
                response: res,
                message: messages.task.edit_success,
                data: tasks,
                status: 203,

            })
        } catch (error: any) {
            next(error)
        }

    }
    ,

    async fetchTaskAssociatedWithUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role === 'ADMIN') {
                console.log(res.locals.user);
                if (!req.query.userId) {
                    const tasks = await TaskService.getAllTasks();
                    return successResponse({
                        response: res,
                        message: messages.task.all_get_success,
                        data: tasks,
                        status: 200
                    })
                }
                const userId: string = req.query.userId as string;
                const task = await TaskService.getAllTasksWithUserId(userId)
               // await ActivityService.createActivityLog(userId,user.name,messages.task.all_get_success+"Action performed by admin for "+ userId);
                return successResponse({
                    response: res,
                    message: messages.task.all_get_success,
                    data: task,
                    status: 200
                })
            }
            else {
                console.log(res.locals.user);
                const userId = user._id;
                const task = await TaskService.getAllTasksWithUserId(userId);
                //await ActivityService.createActivityLog(userId,user.name,messages.task.all_get_success);
               
                return successResponse({
                    response: res,
                    message: messages.task.all_get_success,
                    data: task,
                    status: 200
                })
            }
        } catch (error) {
            next(error)
        }


    },

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role === 'ADMIN') {
                const id = req.params.id;
                const result = await TaskService.deleteTask(id, user._id.toString(), true);
                await ActivityService.createActivityLog(user._id,user.name,messages.task.delete_success +'deleted by admin');
                return successResponse({
                    response: res,
                    message: messages.task.delete_success,
                    data: result
                })
            }
            else {
                const id = req.params.id;
                const result = await TaskService.deleteTask(id, user._id.toString(), false);
                await ActivityService.createActivityLog(user._id,user.name,messages.task.delete_success +'deleted by user');

                return successResponse({
                    response: res,
                    message: messages.task.delete_success,
                    data: result
                })
            }
        } catch (error) {
            next(error)
        }
    }
,
    async fetchTaskUpdateRule(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await TaskService.getTaskUpdateRule();
          
            return successResponse({
                response: res,
                message: messages.task.get_rule_success,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }
,
    async updateTaskState(req: Request, res: Response, next: NextFunction) {
        try {
            const stage:string = req.body?.stage;
            const { id } = req.params;
            const userId = res.locals.user._id;
            const result = await TaskService.updateTaskState(id, userId,stage)
            const msg = "Task ID "+ id + "update to stage "+ stage ;
            await ActivityService.createActivityLog(userId,res.locals.user.name,msg);
            return successResponse({
                response: res,
                message: messages.task.task_state_update_success,
                data: {success:result}
            })
        } catch (error) {
            next(error)
        }
    },

    async deleteManyTask(req: Request, res: Response, next: NextFunction) {
        const user = res.locals.user;
        try {
            const ids= req.body.ids;
           
            const result= await TaskService.deleteManyTasks(user._id.toString(),ids);
            return successResponse({
                response: res,
                message: messages.task.delete_success,
                data: result
            })
        }
        catch(error){
            next(error);
        }

    }

}

export default TaskController;

