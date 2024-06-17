import { Router } from "express";
import TaskController from "./controller";
import deSerializeUser from "../../../middleware/deSerializeUser";
import requireUser from "../../../middleware/requireUser";


const TaskRouter = Router();
TaskRouter.use(deSerializeUser)
TaskRouter.use(requireUser)


TaskRouter.route('/').post(TaskController.createTask);
TaskRouter.route('/deletemany').post(TaskController.deleteManyTask);
TaskRouter.route('/rule').get(TaskController.fetchTaskUpdateRule);
TaskRouter.route('/state/:id').patch(TaskController.updateTaskState);
TaskRouter.route('/:id').get(TaskController.getTaskById);
TaskRouter.route('/').get(TaskController.fetchTaskAssociatedWithUserId);
TaskRouter.route('/:id').patch(TaskController.updateTasks);
TaskRouter.route('/:id').delete(TaskController.deleteTask);

export default TaskRouter;