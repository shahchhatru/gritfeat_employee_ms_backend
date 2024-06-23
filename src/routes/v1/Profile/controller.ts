import { Response, Request, NextFunction } from "express";
import { successResponse } from "../../../utils/HttpResponse";
import { messages } from "../../../utils/Messages";
import ProfileService from "./service";

const ProfileController = {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const result = await ProfileService.getProfileByUserId(user._id.toString());
            return successResponse({
                response: res,
                message: messages.profile.one_get_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    },
    async getALLProfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ProfileService.getALLProfiles();
            return successResponse({
                response: res,
                message: messages.profile.all_get_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }



    },

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const body = req.body;
            const result = await ProfileService.updateProfileByUserId(user._id.toString(), body);
            return successResponse({
                response: res,
                message: messages.profile.edit_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    },

    async deleteProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const result = await ProfileService.deleteProfileByUserId(user._id.toString());
            return successResponse({
                response: res,
                message: messages.profile.delete_success,
                data: result,
                status: 200
            })
        } catch (error) {
            next(error);
        }
    }
}

export default ProfileController;
