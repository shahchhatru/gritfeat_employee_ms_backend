import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import ApplicationService from './service';
import CustomError from '../../../utils/Error';
import { redisClient } from '../../../config/redisConfig'; // Import the Redis client

const ApplicationController = {
    async createApplication(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)
            const body = req.body;
            const result = await ApplicationService.createApplication({ ...body, user: user._id, organization: user.organizationId });

            // Invalidate the cache for all applications for the organization
            const cacheKey = `applications:organization:${user.organizationId}`;
            await redisClient.del(cacheKey);
            const supervisorCacheKey = `applications:supervisor:${body.supervisor?.toString()}`;
            await redisClient.del(supervisorCacheKey);
            const usercacheKey = `applications:user:${user._id}`;
            await redisClient.del(usercacheKey);




            return successResponse({
                response: res,
                message: messages.application.creation_success,
                data: result,
                status: 201
            });
        } catch (error) {
            next(error);
        }
    },

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)
            if (user.role !== 'SUPERVISOR' && user.role !== 'ADMIN') {
                throw new CustomError(messages.application.edit_forbidden, 404);
            }

            const body = req.body;
            const application = await ApplicationService.getApplicationById(id);
            if (application.supervisor?.toString() !== user._id) throw new CustomError(messages.user.user_not_found, 404);

            const result = await ApplicationService.updateApplication(id, { status: body.status });
            const usercacheKey = `applications:user:${user._id}`;
            await redisClient.del(usercacheKey);
            // Invalidate the cache for the specific application and all applications for the organization
            const cacheKey = `application:${id}`;
            await redisClient.del(cacheKey);
            const orgCacheKey = `applications:organization:${user.organizationId}`;
            await redisClient.del(orgCacheKey);
            const supervisorCacheKey = `applications:supervisor:${application.supervisor?.toString()}`;
            await redisClient.del(supervisorCacheKey);


            return successResponse({
                response: res,
                message: messages.application.edit_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async editApplication(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)

            const body = req.body;
            const application = await ApplicationService.getApplicationById(body.id);
            if (application.user?.toString() !== user._id) throw new CustomError(messages.application.edit_forbidden, 404);

            const result = await ApplicationService.updateApplication(body.id, { ...body, user: user._id });

            // Invalidate the cache for the specific application and all applications for the organization
            const cacheKey = `application:${body.id}`;
            await redisClient.del(cacheKey);
            const usercacheKey = `applications:user:${user._id}`;
            await redisClient.del(usercacheKey);
            const orgCacheKey = `applications:organization:${user.organizationId}`;
            await redisClient.del(orgCacheKey);
            const supervisorCacheKey = `applications:supervisor:${application.supervisor?.toString()}`;
            await redisClient.del(supervisorCacheKey);


            return successResponse({
                response: res,
                message: messages.application.edit_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteApplication(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404)
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404)

            const id = req.params.id;
            const application = await ApplicationService.getApplicationById(id);
            if (application.user?.toString() !== user._id && application.supervisor?.toString() !== user._id) throw new CustomError(messages.application.edit_forbidden, 404);

            const result = await ApplicationService.deleteApplication(id);

            // Invalidate the cache for the specific application and all applications for the organization
            const cacheKey = `application:${id}`;
            await redisClient.del(cacheKey);
            const orgCacheKey = `applications:organization:${user.organizationId}`;
            await redisClient.del(orgCacheKey);
            const usercacheKey = `applications:user:${user._id}`;
            await redisClient.del(usercacheKey);
            const supervisorCacheKey = `applications:supervisor:${application.supervisor?.toString()}`;
            await redisClient.del(supervisorCacheKey);

            return successResponse({
                response: res,
                message: messages.application.delete_success,
                data: result,
                status: 200
            });
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

            const cacheKey = `applications:organization:${id}`;

            // Check if the data is in the cache
            const cachedApplications = await redisClient.get(cacheKey);
            if (cachedApplications) {
                return successResponse({
                    response: res,
                    message: messages.application.all_get_success,
                    data: JSON.parse(cachedApplications),
                    status: 200
                });
            }

            const result = await ApplicationService.getApplicationByOrganizationId(id);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getApplicationByOrganization(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 404);

            const cacheKey = `applications:organization:${user.organizationId}`;

            // Check if the data is in the cache
            const cachedApplications = await redisClient.get(cacheKey);
            if (cachedApplications) {
                return successResponse({
                    response: res,
                    message: messages.application.all_get_success,
                    data: JSON.parse(cachedApplications),
                    status: 200
                });
            }

            const result = await ApplicationService.getApplicationByOrganizationId(user.organizationId.toString());

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getApplicationBySupervisorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const user = res.locals.user;
            if (user._id.toString() != id) throw new CustomError(messages.actions.forbidden_message, 404);

            const cacheKey = `applications:supervisor:${id}`;

            // Check if the data is in the cache
            const cachedApplications = await redisClient.get(cacheKey);
            if (cachedApplications) {
                return successResponse({
                    response: res,
                    message: messages.application.all_get_success,
                    data: JSON.parse(cachedApplications),
                    status: 200
                });
            }

            const result = await ApplicationService.getApplicationBySupervisorId(id);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getApplicationsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            const cacheKey = `applications:user:${id}`;

            // Check if the data is in the cache
            const cachedApplications = await redisClient.get(cacheKey);
            if (cachedApplications) {
                return successResponse({
                    response: res,
                    message: messages.application.all_get_success,
                    data: JSON.parse(cachedApplications),
                    status: 200
                });
            }

            const result = await ApplicationService.getApplicationByUserId(id);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.application.all_get_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    }
};

export default ApplicationController;
