import { Router } from 'express';
import AttendenceController from './controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';


const attendenceRouter = Router();
attendenceRouter.use(deSerializeUser)
attendenceRouter.use(requireUser)
attendenceRouter.route('/check').post(AttendenceController.checkAttendence);
attendenceRouter.route('/adminAttendenceToken').get(AttendenceController.createAdminAttendenceToken);
attendenceRouter.route('/adminAttendence').get(AttendenceController.getAdminAttendenceInstances);
attendenceRouter.route('/myAttendence').get(AttendenceController.getMyAttendence);
attendenceRouter.route('/').get(AttendenceController.getAllAttendence);



export default attendenceRouter;