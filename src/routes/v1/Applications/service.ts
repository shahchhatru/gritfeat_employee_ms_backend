import { Application } from '../../../types/applications';
import CustomError from '../../../utils/Error';
import { messages } from '../../../utils/Messages';
import { createApplication, deleteApplication, getAllApplications, getApplicationByOrganizationId, getApplicationBySupervisorId, getApplicationByUserId, updateApplication, getApplicationById } from './repository';


const ApplicationService = {
    async createApplication(application: Application) {

        const t = await createApplication(application);
        return t;

    },
    async updateApplication(id: string, data: Partial<Application>) {
        const res = await updateApplication(id, data);
        if (!res) throw new CustomError(messages.application.edit_forbidden, 404)

        return res;
    },

    async updateApplicationByUserId(id: string, userId: string, data: Partial<Application>) {
        const application = await getApplicationById(id);
        if (!application) throw new CustomError(messages.application.not_found, 404)
        if (application.user?.toString() !== userId) {
            throw new CustomError(messages.application.edit_forbidden, 403)
        }
        const res = await this.updateApplication(id, data);
        return res;
    },

    async updateApplicationBySupervisorId(id: string, supervisorId: string, data: Partial<Application>) {
        const application = await getApplicationById(id);
        if (!application) throw new CustomError(messages.application.not_found, 404)
        if (application.supervisor?.toString() !== supervisorId) {
            throw new CustomError(messages.application.edit_forbidden, 403)
        }
        const res = await this.updateApplication(id, data);
        return res;
    },
    async deleteApplication(id: string) {
        const res = await deleteApplication(id);
        if (!res) throw new CustomError(messages.application.delete_forbidden, 404)

        return res;
    },

    async getApplicationById(id: string) {
        const application = await getApplicationById(id);
        if (!application) throw new CustomError(messages.application.not_found, 404);
        return application;
    },


    async getApplicationByUserId(userId: string) {
        const application = await getApplicationByUserId(userId);
        if (!application) throw new CustomError(messages.application.not_found, 404);
        return application;
    },
    async getApplicationByOrganizationId(organizationId: string) {
        const application = await getApplicationByOrganizationId(organizationId);
        if (!application) throw new CustomError(messages.application.not_found, 404);
        return application;
    },
    async getApplicationBySupervisorId(supervisorId: string) {
        const application = await getApplicationBySupervisorId(supervisorId);
        if (!application) throw new CustomError(messages.application.not_found, 404);
        return application;
    },
    async getAllApplications() {
        const application = await getAllApplications();
        if (!application) throw new CustomError(messages.application.not_found, 404);
        return application;
    }


}


export default ApplicationService;