import { Router } from "express";

import OtpController from "./controller";

const OTPRouter = Router({ mergeParams: true })

// Create a Comment
OTPRouter.route('/verify').post(OtpController.verifyOTP);
OTPRouter.route('/generate').post(OtpController.generateOTP);
OTPRouter.route('/ogranization/verify').post(OtpController.verifyOrganizationOTP);
OTPRouter.route('/ogranization/generate').post(OtpController.generateOrganizationOTP);

export default OTPRouter;