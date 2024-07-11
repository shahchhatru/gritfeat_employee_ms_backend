import CustomError from "../../../utils/Error";
import { messages } from '../../../utils/Messages';
import env from "../../../config/env"
import { Organization } from "../../../types/organizations"
import OTPService from "../OTP/service";
import { sendEmailWithHTML } from "../../../utils/otp";
import { createOrganization, getOrganizationById, getOrganizationByEmail, getAllOrganizations, deleteOrganizationById, updateOrganizationById, getOrganizationByLinkedin } from "./repostiory";
import UserService from "../User/service";

const OrganizationService = {
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
    },

    async createOrganization(orgData: Organization) {
        this.validateEmail(orgData.email);

        this.validatePassword(orgData.password);
        const org = await createOrganization(orgData);
        if (!org) throw new CustomError(messages.organization.create_failed, 400);
        if (!org._id) throw new CustomError(messages.organization.create_failed, 400);

        const otp = await OTPService.generateOrganizationOTP(org._id.toString());
        if (!otp) throw new CustomError(messages.otp.creation_failed, 400);
        const verificationLink = `${env.frontendurl}/auth/verifyToken/?userId=${org._id}&otp=${otp}`
        const html = `<p>Thank you for signing up with us!</p><p>Here is the link ${verificationLink} for verifying your account:</p><p><a href="${verificationLink}"><button>Verify your account</button></a></p>`
        const user = await UserService.generateOrgAdnimUser({
            email: orgData.email,
            password: orgData.password,
            name: `${orgData.name} Admin`,
            organizationId: org._id.toString(),
            role: "ADMIN",
        })
        const org1 = await updateOrganizationById(org._id.toString(), { admin: String(user._id) })
        if (!org1) throw new CustomError(messages.organization.create_failed, 400);
        await sendEmailWithHTML(html, orgData.email, "Verify your account");
        return org1;

    },


    async getOrganizationById(id: string) {
        const org = await getOrganizationById(id);
        if (!org) throw new CustomError(messages.organization.not_found, 400);
        return org;
    },

    async getOrganizationByEmail(email: string) {
        const org = await getOrganizationByEmail(email);
        if (!org) throw new CustomError(messages.organization.not_found, 400);
        return org;
    },

    async getAllOrganizations() {
        const orgs = await getAllOrganizations();
        if (!orgs) throw new CustomError(messages.organization.not_found, 400);
        return orgs;
    },

    async deleteOrganizationById(id: string) {
        const org = await deleteOrganizationById(id);
        if (!org) throw new CustomError(messages.organization.not_found, 400);
        return org;
    },

    async getOrganizationByLinkedin(linkedin: string) {
        const org = await getOrganizationByLinkedin(linkedin);
        if (!org) throw new CustomError(messages.organization.not_found, 400);
        return org;
    },

    async updateOrganizationById(id: string, orgData: Partial<Organization>) {
        const org = await updateOrganizationById(id, orgData);
        if (!org) throw new CustomError(messages.organization.not_found, 400);
        return org;
    },




}


export default OrganizationService;