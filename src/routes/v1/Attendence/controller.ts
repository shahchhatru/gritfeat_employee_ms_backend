import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import AttendenceService from './service';
import CustomError from '../../../utils/Error';
import { messages } from '../../../utils/Messages';
import { Attendence } from '../../../types/attendence';


const AttendenceController = {

    async checkAttendence(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            const body = req.body;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            let attendence: Attendence;
            attendence = await AttendenceService.getAttendenceByUserIdAndDate(user._id.toString(), body.date);
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


}

export default AttendenceController;



