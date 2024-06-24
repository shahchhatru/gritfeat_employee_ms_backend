import { Router } from 'express';
import ApplicationController from './controller';
const ApplicationRouter = Router();

ApplicationRouter.route('/user/:id').get(ApplicationController.getApplicationsByUserId);
ApplicationRouter.route('/org/:id').get(ApplicationController.getApplicationByOrganizationId);
ApplicationRouter.route('/supervisor/:id').get(ApplicationController.getApplicationBySupervisorId);
ApplicationRouter.route('/').post(ApplicationController.createApplication);
ApplicationRouter.route('/:id').post(ApplicationController.editApplication);
ApplicationRouter.route('/status/:id').patch(ApplicationController.updateStatus);
ApplicationRouter.route('/:id').delete(ApplicationController.deleteApplication);


export default ApplicationRouter;