import { Router } from 'express';
import ApplicationController from './controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';
const ApplicationRouter = Router();
ApplicationRouter.use(deSerializeUser)
ApplicationRouter.use(requireUser)
ApplicationRouter.route('/user/:id').get(ApplicationController.getApplicationsByUserId);
ApplicationRouter.route('/org/:id').get(ApplicationController.getApplicationByOrganizationId);
ApplicationRouter.route('/org').get(ApplicationController.getApplicationByOrganization);
ApplicationRouter.route('/supervisor/:id').get(ApplicationController.getApplicationBySupervisorId);
ApplicationRouter.route('/').post(ApplicationController.createApplication);
ApplicationRouter.route('/:id').post(ApplicationController.editApplication);
ApplicationRouter.route('/status/:id').patch(ApplicationController.updateStatus);
ApplicationRouter.route('/:id').delete(ApplicationController.deleteApplication);


export default ApplicationRouter;