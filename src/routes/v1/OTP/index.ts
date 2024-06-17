import { Router } from "express";

import OtpController from "./controller";

const OTPRouter = Router({mergeParams:true})

// Create a Comment
OTPRouter.route('/verify').post(OtpController.verifyOTP);
OTPRouter.route('/generate').post(OtpController.generateOTP);

export default OTPRouter;