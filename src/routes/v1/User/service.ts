import CustomError from "../../../utils/Error";
import { messages } from '../../../utils/Messages';
import { User } from "../../../types/user"
import env from "../../../config/env"
import { createUserRepo, deleteUserById, getAllUsers, getAllUsersNameID, getUserByEmail, getUserbyOrganizationID, updateUser } from "./repository";
import OTPService from "../OTP/service";
import { sendEmailWithHTML } from "../../../utils/otp";
const UserService = {
    async createUser(userData: User) {
        this.validateEmail(userData.email);
        this.validatePassword(userData.password);

        const data = await createUserRepo(userData);
        if (!data) throw new CustomError(messages.auth.invalid_account, 403)
        if (!data._id) throw new CustomError(messages.auth.invalid_account, 403)
        const otp = await OTPService.generateOTP(data._id.toString());
        console.log({ otp: otp.value })
        const htmlContent = `<p> Click here to verify the email <a href="${env.frontendurl}/login/otp/${otp.value}" style="background:blue;color:white;padding:8px 4px;">Verify</a>`
        await sendEmailWithHTML(htmlContent, userData.email);
        return data;

    },

    async generateOrgAdnimUser(userData: User) {
        this.validateEmail(userData.email);
        this.validatePassword(userData.password);
        const data = await createUserRepo(userData);
        if (!data) throw new CustomError(messages.auth.invalid_account, 403)
        if (!data._id) throw new CustomError(messages.auth.invalid_account, 403)
        return data;
    },


    async getUser(id: string) {
        const users = await getAllUsers();
        const user = users.find(user => user._id == id);

        if (!user) {
            throw new CustomError(messages.user.user_not_found, 404);
        }

        return user;
    },


    validateEmail(email: string) {
        // Regular expression pattern for email validation
        var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        //check if email matches the pattern 

        if (pattern.test(email)) {
            return true;
        } else {
            //check if email 
            if (email.length === 0) {
                throw new CustomError(messages.email.empty_email_address, 400)

            } else if (!email.includes('@') || !email.includes('.')) {
                throw new CustomError(messages.email.invalid_email_format, 400)
            } else {
                throw new CustomError(messages.email.invalid_message, 400);
            }
        }

    },


    validatePassword(password: string) {
        // Regular expression pattern for password validation
        var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8,}$/;

        // Check if the password matches the pattern
        if (pattern.test(password)) {
            return true;
        } else {
            // Check for specific cases and throw descriptiveCustomError messages using theCustomErrorMessages object
            if (password.length < 8) {
                throw new CustomError(messages.password.errorMessages.minLength, 400);
            } else if (!/\d/.test(password)) {
                throw new CustomError(messages.password.errorMessages.digitRequired, 400);
            } else if (!/[A-Z]/.test(password)) {
                throw new CustomError(messages.password.errorMessages.uppercaseRequired, 400);
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                throw new CustomError(messages.password.errorMessages.specialCharRequired, 400);
            } else {
                throw new CustomError(messages.password.errorMessages.invalidPassword, 400);
            }
        }
    }
    ,

    getUsers() {
        return getAllUsers();
    },

    getAllUsersNameandID() {
        return getAllUsersNameID();
    },

    async getUserbyOrganizationID(orgId: string) {
        const user = await getUserbyOrganizationID(orgId);

        if (!user) {
            throw new CustomError(messages.user.user_not_found, 404);
        }

        return user;
    },

    async verifyUserwithTemporaryPassword(email: string, password: string, newPassword: string) {
        const user = await getUserByEmail(email);
        console.log({ user })
        if (!user) {
            throw new CustomError(messages.user.user_not_found, 404);
        }
        // if (user._id.toString()) {
        //     throw new CustomError(messages.user.user_not_found, 404);
        // }
        const ispasswordCorrect = await user.comparePassword(password);

        if (!ispasswordCorrect) {
            throw new CustomError(messages.user.invalid_password, 401);
        }
        if (user?.isVerified) {
            throw new CustomError(messages.user.user_already_verified, 400);
        }


        user.setVerified();
        user.verifiedAt = new Date().toISOString();
        user.password = newPassword
        const updatedUser = await user.save();
        return updatedUser;
    }

    ,

    async deleteUserById(id: string) {
        const user = deleteUserById(id);
        if (!user) {
            throw new CustomError(messages.user.user_not_found, 404);
        }
        return user;
    }
    ,


    async updateUser(id: string, userData: Partial<User>) {
        const user = await updateUser(id, userData);
        if (!user) {
            throw new CustomError(messages.user.user_not_found, 404);
        }
        return user;
    }


}

export default UserService;
