import { Router } from 'express';
import OrganizationController from './controller';

const OrganizationRouter = Router();

OrganizationRouter.route('/').get(OrganizationController.getOrganization);
OrganizationRouter.route('/').post(OrganizationController.createOrganization);
OrganizationRouter.route('/:id').patch(OrganizationController.updateOrganizationById);
OrganizationRouter.route('/:id').delete(OrganizationController.deleteOrganizationById);

export default OrganizationRouter;



