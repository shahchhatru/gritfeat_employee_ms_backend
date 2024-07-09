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
            const { token, status } = req.body;

            if (!user) throw new CustomError(messages.user.user_not_found, 404);

            const currentDate = new Date().toString(); // Use a consistent date format
            let attendance: Attendence | null;

            attendance = await AttendenceService.getAttendenceByUserIdAndDate(user._id.toString(), currentDate);

            const organization = await OrganizationService.getOrganizationById(user.organizationId.toString());
            if (!organization.admin) throw new CustomError(messages.user.user_not_found, 404);

            const adminAttendanceInstance = await AttendenceService.AdminAttendenceBydate(user.organizationId.toString(), organization.admin.toString(), currentDate);
            //  console.log({ adminAttendanceInstance })
            if (!adminAttendanceInstance.token) throw new CustomError(messages.attendence.not_found, 404);
            if (token !== adminAttendanceInstance.token.toString()) throw new CustomError(messages.attendence.attendence_token_validation_failed, 404);
            //console.log({ token })
            if (!attendance) {
                console.log({ token })
                attendance = await AttendenceService.createAttendence({
                    user: user._id.toString(),
                    organization: user.organizationId.toString(),
                    date: currentDate,
                    status: status,
                    token: token
                });
            } else {
                attendance = await AttendenceService.updateAttendence(user._id.toString(), currentDate, { status: status });
            }

            return successResponse({
                response: res,
                message: messages.attendence.creation_success,
                data: attendance,
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
            const token = await AttendenceService.generateAdminAttendence(user.organizationId.toString(), user._id.toString(), new Date().toString());
            return successResponse({
                response: res,
                message: messages.attendence.successfully_displayed_admin_qr,
                data: token,
                status: 200,
            });
        } catch (error) {
            next(error);
        }


    },

    async getMyAttendence(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
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
    }
}

export default AttendenceController;



