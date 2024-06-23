import { UserModel } from "../../../models/user";
import CustomError from "../../../utils/Error";
import { messages } from '../../../utils/Messages';
import { OTPModel } from "../../../models/otp";
import { OrgOTPModel } from "../../../models/orgOTP";
import { OrganizationModel } from "../../../models/organization";
import UserService from "../User/service";

const OTPService = {
    async generateOTP(userId: string) {

        const otp = await OTPModel.generateOTP(userId);
        if (!otp) {
            throw new CustomError(messages.otp.creation_failed, 403);
        }
        console.log(`OTP for user ${userId} is ${otp}`);
        return otp;


    },

    async verifyOTP(userId: string, otp: number) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new CustomError(messages.user.user_not_found, 404);
        }
        const isVerified = await OTPModel.verifyOTP(userId, otp);
        if (!isVerified) {
            throw new CustomError(messages.otp.verification_failed, 401);
        }
        user.setVerified();
        await user.save();



    }


    ,
    async generateOrganizationOTP(orgId: string) {
        const otp = await OrgOTPModel.generateOTP(orgId);
        console.log(`OTP for org ${orgId} is ${otp}`);
        if (!otp) {
            throw new CustomError(messages.otp.creation_failed, 403);
        }
        console.log(`OTP for org ${orgId} is ${otp}`);
        return otp;
    },

    async verifyOrganizationOTP(orgId: string, otp: number) {
        const org = await OrganizationModel.findById(orgId);
        if (!org) {
            throw new CustomError(messages.otp.verification_failed, 401);
        }
        const isVerified = await OrgOTPModel.verifyOTP(orgId, otp);
        const user = await UserService.getUser(org.admin?.toString() || '');

        if (!isVerified) {
            throw new CustomError(messages.otp.verification_failed, 401);
        }
        org.setVerified();

        await org.save();
        user.setVerified();
        await user.save();

        return org;
    }

}


export default OTPService;