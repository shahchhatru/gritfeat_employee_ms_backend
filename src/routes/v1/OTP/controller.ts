import { Response, Request, NextFunction } from 'express';

import OTPService from './service';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';


const OtpController = {
    async generateOTP(req: Request<{ userId: string }, unknown, {}>, res: Response, next: Function) {
        try {
            const { userId } = req.params;
            const result = await OTPService.generateOTP(userId);
            return successResponse({
                response: res,
                message: messages.otp.success,
                data: result,
            })

        } catch (error) {
            next(error);
        }
    },

    async verifyOTP(req: Request<{ userId: string }, unknown, { otp: number }>, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const { otp } = req.body;
        try {
            await OTPService.verifyOTP(userId, otp);
            return successResponse({
                response: res,
                message: messages.otp.verification_success,

            })
        } catch (error) {
            next(error);
        }
    }

    ,
    async generateOrganizationOTP(req: Request<{ orgId: string }, unknown, {}>, res: Response, next: NextFunction) {
        try {
            const { orgId } = req.params;
            const result = await OTPService.generateOrganizationOTP(orgId);
            return successResponse({
                response: res,
                message: messages.otp.success,
                data: result,
            })
        } catch (error) {
            next(error);
        }
    },

    async verifyOrganizationOTP(req: Request<{ userId: string }, unknown, { otp: number }>, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const { otp } = req.body;
        try {// const htmlMessage = `
            //     <html>
            //     <body>
            //         <h1>This is a test HTML email</h1>
            //         <p>Hello, this is a test email with <strong>HTML content</strong>!</p>
            //     </body>
            //     </html>
            // `;

            // sendEmailWithHTML(htmlMessage);
            const result = await OTPService.verifyOrganizationOTP(userId, otp);
            return successResponse({
                response: res,
                message: messages.otp.verification_success,
                data: result,
            })
        } catch (error) {
            next(error);
        }
    }



}

export default OtpController;