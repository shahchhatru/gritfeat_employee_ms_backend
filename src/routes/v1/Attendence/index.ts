import { Router } from 'express';
import AttendenceController from './controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';


const attendenceRouter = Router();
attendenceRouter.use(deSerializeUser)
attendenceRouter.use(requireUser)
attendenceRouter.route('/').post(AttendenceController.checkAttendence);


export default attendenceRouter;