import { Router } from "express";
import ActivityController from "./controller";
import deSerializeUser from "../../../middleware/deSerializeUser";
import requireUser from "../../../middleware/requireUser";

const ActivityRouter = Router();
ActivityRouter.use(deSerializeUser)
ActivityRouter.use(requireUser)


ActivityRouter.route('/').get(ActivityController.fetchActivities);



export default ActivityRouter;