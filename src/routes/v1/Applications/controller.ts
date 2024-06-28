import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import ApplicationService from './service';
import CustomError from '../../../utils/Error';


const ApplicationController = {
    async createApplication(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)
            const body = req.body;
            const result = await ApplicationService.createApplication({ ...body, user: user._id, organization: user.organizationId });
            return successResponse({
                response: res,
                message: messages.application.creation_success,
                data: result,
                status: 201
            })
        } catch (error) {
            next(error);
        }
    },

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)
            if (user.role !== 'supervisor') throw new CustomError(messages.application.edit_forbidden, 404)
            const body = req.body;
            const application = await ApplicationService.getApplicationById(body.id);
            if (application.supervisor?.toString() !== user._id) throw new CustomError(messages.user.user_not_found, 404)
            const result = await ApplicationService.updateApplication(body.id, { status: body.status });
            return successResponse({
                response: res,
                message: messages.application.edit_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    },


    async editApplication(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)
            // if (user.role !== 'supervisor') throw new CustomError(messages.application.edit_forbidden, 404)
            const body = req.body;
            const application = await ApplicationService.getApplicationById(body.id);
            if (application.user?.toString() !== user._id) throw new CustomError(messages.application.edit_forbidden, 404)
            const result = await ApplicationService.updateApplication(body.id, { ...body, user: user._id });
            return successResponse({
                response: res,
                message: messages.application.edit_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }

    },

    async deleteApplication(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)
            // if (user.role !== 'supervisor') throw new CustomError(messages.application.edit_forbidden, 404)
            const id = req.params.id;
            const application = await ApplicationService.getApplicationById(id);
            if (application.user?.toString() !== user._id) throw new CustomError(messages.application.edit_forbidden, 404)
            const result = await ApplicationService.deleteApplication(id);
            return successResponse({
                response: res,
                message: messages.application.delete_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }

    },

    async getApplicationByOrganizationId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const user = res.locals.user;
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 404)
            if (user.organizationId.toString() !== id) throw new CustomError(messages.actions.forbidden_message, 404)
            const result = await ApplicationService.getApplicationByOrganizationId(id);
            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }

    },
    async getApplicationByOrganization(req: Request, res: Response, next: NextFunction) {
        try {

            const user = res.locals.user;
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 404)

            const result = await ApplicationService.getApplicationByOrganizationId(user.organizationId.toString());
            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }

    },

    async getApplicationBySupervisorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const user = res.locals.user;
            if (user._id.toString() != id) throw new CustomError(messages.actions.forbidden_message, 404);
            const result = await ApplicationService.getApplicationBySupervisorId(id);
            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    }
    ,

    async getApplicationsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const user = res.locals.user;
            if (user._id.toString() != id) throw new CustomError(messages.actions.forbidden_message, 404);
            const result = await ApplicationService.getApplicationByUserId(id);
            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    }


}

export default ApplicationController;