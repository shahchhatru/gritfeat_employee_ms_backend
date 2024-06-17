import { UserModel } from "../../../models/user";
import CustomError from "../../../utils/Error";
import { messages } from '../../../utils/Messages';
import { OTPModel } from "../../../models/otp";

const OTPService ={
    async generateOTP(userId:string){
        
            const otp = await OTPModel.generateOTP(userId);
            if(!otp){
                throw new CustomError(messages.otp.creation_failed,403);
            }
            console.log(`OTP for user ${userId} is ${otp}`);
            return otp;
         
       
    },

    async verifyOTP(userId:string,otp:number){
        const user = await UserModel.findById(userId);
        if(!user){
            throw new CustomError(messages.user.user_not_found,404);
        }
        const isVerified = await OTPModel.verifyOTP(userId, otp);
        if(!isVerified){
            throw new CustomError(messages.otp.verification_failed,401);
        }
        user.setVerified();
        await user.save();



    }
}


export default OTPService;