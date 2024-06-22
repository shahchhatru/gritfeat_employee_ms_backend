import { Response, Request, NextFunction } from 'express';
import { Organization } from '../../../types/organizations';
import OrganizationService from './service';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import CustomError from '../../../utils/Error';


const OrganizationController = {
    async createOrganization(req: Request<unknown, unknown, Organization>, res: Response, next: NextFunction) {
        try {
            const orgData = req.body;
            const result = await OrganizationService.createOrganization(orgData);
            return successResponse({
                response: res,
                message: messages.organization.createsuccess,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async getOrganization(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, email, linkedin } = req.query;

            let result;
            if (id) {
                result = await OrganizationService.getOrganizationById(id as string);
            } else if (email) {
                result = await OrganizationService.getOrganizationByEmail(email as string);
            } else if (linkedin) {
                result = await OrganizationService.getOrganizationByLinkedin(linkedin as string);
            } else {
                throw new CustomError("Please provide an id, email or linkedin", 400);
            }

            return successResponse({
                response: res,
                message: messages.organization.fetch_success,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteOrganizationById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const result = await OrganizationService.deleteOrganizationById(id);
            return successResponse({
                response: res,
                message: messages.organization.delete_success,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },


    async updateOrganizationById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const orgData = req.body;
            const result = await OrganizationService.updateOrganizationById(id, orgData);
            return successResponse({
                response: res,
                message: messages.organization.update_success,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

}


export default OrganizationController;
