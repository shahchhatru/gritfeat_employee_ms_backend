import { Task } from '../../../types/task';
import CustomError from '../../../utils/Error';
import { messages } from '../../../utils/Messages';
import { createTask, deleteTask,  getAllTasksWithPopulatedAssignees, getTaskById, updateTask ,getTasksByUserId, deleteTaskByAssigner,updateTaskState, deleteTasks} from './repository';


const TaskService={
    async createTask(task:Task){
        
        const t = await createTask(task);
        return t;
        
    },

    async checkTaskForUpdate(id:string,userId:string,message:string){
        const data= await getTaskById(id);
        if(!data) throw new CustomError(messages.task.not_found,404);
        const assigner=data.assigner.toString();
        if(assigner!==userId){
            throw new CustomError(message,403);
        }
    },

    async updateTask(taskid:string,userId:string,data:Partial<Task>){
        await this.checkTaskForUpdate(taskid,userId,messages.task.edit_forbidden);
        const res= await updateTask(taskid,data);
        if(!res) throw new CustomError(messages.task.edit_forbidden,404)
    
        return res;

    },

    async deleteTask(taskid:string,userId:string,admin:boolean){
        await this.checkTaskForUpdate(taskid,userId,messages.task.delete_forbidden);
        let res:any = null;
        if(admin){
             res = await deleteTask(taskid);
        }else{
             res= await deleteTaskByAssigner(taskid,userId);
        }
        
        return res;
    },

    async getTaskById(taskid:string){
        const task = await getTaskById(taskid);
        if(!task) throw new CustomError(messages.task.not_found,404);
        return task;
    }
    ,

    async getAllTasks(){
        //const task = await getAllTasks();
        const tasks = await getAllTasksWithPopulatedAssignees();
        return tasks;
    },

    async getAllTasksWithUserId(userId:string){
        const tasks = await getTasksByUserId(userId);
    return tasks;
    },


    async getTaskUpdateRule(){
        return [
            {
                'TODO':['PROGRESS'],
                'PROGRESS':['DONE','TODO'],
                'DONE':[]
            }
        ]
    }
    ,

    async updateTaskState(taskid:string,userId:string,stage:string){
      const task=await updateTaskState(taskid,userId,stage);
      return task;
        
    },


    async deleteManyTasks(userId:string,taskids:string[]){
        for (let i = 0; i < taskids.length; i++) {
            const taskid = taskids[i];
            await this.checkTaskForUpdate(taskid,userId,messages.task.delete_forbidden);
        }
        const tasks=await deleteTasks(taskids);
        return tasks;
    }
}


export default TaskService;