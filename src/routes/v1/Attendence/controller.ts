import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import AttendenceService from './service';
import CustomError from '../../../utils/Error';
import { messages } from '../../../utils/Messages';
import { Attendence } from '../../../types/attendence';
import OrganizationService from '../Organizations/service';


const AttendenceController = {

    async checkAttendence(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const body = req.body;

            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            let attendence: Attendence;
            attendence = await AttendenceService.getAttendenceByUserIdAndDate(user._id.toString(), body.date);
            const organization = await OrganizationService.getOrganizationById(user.organizationId.toString());
            if (!organization.admin) throw new CustomError(messages.user.user_not_found, 404);
            const adminAttendenceInstance = await AttendenceService.AdminAttendenceBydate(user.organizationId.toString(), organization?.admin?.toString(), body.date);
            if (!adminAttendenceInstance.token) throw new CustomError(messages.attendence.not_found, 404);
            if (body.token !== adminAttendenceInstance.token) throw new CustomError(messages.attendence.attendence_token_validation_failed, 404);
            if (!attendence) {
                attendence = await AttendenceService.createAttendence({
                    user: user._id.toString(),
                    organization: user.organizationId.toString(),
                    date: body.date,
                    status: body.status,

                });
            } else {
                attendence = await AttendenceService.updateAttendence(user._id.toString(), body.date, { status: body.status });
            }

            return successResponse({
                response: res,
                message: messages.attendence.creation_success,
                data: attendence,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async getAllAttendence(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') {
                const attendance = await AttendenceService.getAttendenceByOrgId(user.organizationId.toString());
                return successResponse({
                    response: res,
                    message: messages.attendence.fetch_success,
                    data: attendance,
                    status: 200,
                });
            }
            const attendences = await AttendenceService.getAttendenceByUserId(user._id.toString());
            return successResponse({
                response: res,
                message: messages.attendence.fetch_success,
                data: attendences,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },



    async getAdminAttendenceInstances(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            const attendences = AttendenceService.AdminAttendenceBydate(user.organizationId.toString(), user._id.toString(), req.query.date as string);
            return successResponse({
                response: res,
                message: messages.attendence.successfully_displayed_admin_qr,
                data: attendences,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async createAdminAttendenceToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            const token = await AttendenceService.generateAdminAttendence(user.organizationId.toString(), user._id.toString(), Date.now().toString());
            return successResponse({
                response: res,
                message: messages.attendence.successfully_displayed_admin_qr,
                data: token,
                status: 200,
            });
        } catch (error) {
            next(error);
        }


    }
}

export default AttendenceController;



