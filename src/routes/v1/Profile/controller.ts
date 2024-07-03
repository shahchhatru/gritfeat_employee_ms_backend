import { Response, Request, NextFunction } from "express";
import { successResponse } from "../../../utils/HttpResponse";
import { messages } from "../../../utils/Messages";
import ProfileService from "./service";
import { redisClient } from '../../../config/redisConfig'; // Import the Redis client

const ProfileController = {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const cacheKey = `profile:${user._id}`;

            // Check if the data is in the cache
            const cachedProfile = await redisClient.get(cacheKey);
            if (cachedProfile) {
                return successResponse({
                    response: res,
                    message: messages.profile.one_get_success,
                    data: JSON.parse(cachedProfile),
                    status: 200,
                });
            }

            const result = await ProfileService.getProfileByUserId(user._id.toString());

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.profile.one_get_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async getALLProfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const cacheKey = 'profiles:all';

            // Check if the data is in the cache
            const cachedProfiles = await redisClient.get(cacheKey);
            if (cachedProfiles) {
                return successResponse({
                    response: res,
                    message: messages.profile.all_get_success,
                    data: JSON.parse(cachedProfiles),
                    status: 200,
                });
            }

            const result = await ProfileService.getALLProfiles();

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.profile.all_get_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const body = req.body;
            console.log({ user, body });
            const result = await ProfileService.updateProfileByUserId(user._id.toString(), body);

            // Invalidate the cache for the updated profile
            const cacheKey = `profile:${user._id}`;
            await redisClient.del(cacheKey);

            return successResponse({
                response: res,
                message: messages.profile.edit_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const result = await ProfileService.deleteProfileByUserId(user._id.toString());

            // Invalidate the cache for the deleted profile
            const cacheKey = `profile:${user._id}`;
            await redisClient.del(cacheKey);

            return successResponse({
                response: res,
                message: messages.profile.delete_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },
};

export default ProfileController;
