import ApplicationModel, { IApplication } from "../../../../models/application";
import { Application } from "../../../../types/applications";
// import mongoose from "mongoose";

export const createApplication = (application: Application): Promise<IApplication> => {
    const newapplicationdata: Partial<IApplication> = {
        ...application
    }
    const applicationd = new ApplicationModel(newapplicationdata);
    return applicationd.save();
}

export const updateApplication = (id: string, data: Partial<Application>): Promise<IApplication | null> => {
    return ApplicationModel.findByIdAndUpdate(id, data, { new: true }).exec();
};

export const deleteApplication = (id: string): Promise<IApplication | null> => {
    return ApplicationModel.findByIdAndDelete(id).exec();
}

export const getAllApplications = (): Promise<IApplication[]> => {
    return ApplicationModel.find().exec();
}

export const getApplicationBySupervisorId = (supervisorId: string): Promise<IApplication[]> => {
    return ApplicationModel.find({ supervisor: supervisorId }).populate('user').exec();
}

export const getApplicationById = (id: string): Promise<IApplication | null> => {
    return ApplicationModel.findOne({ _id: id }).exec();
}

export const getApplicationByOrganizationId = (organizationId: string): Promise<IApplication[]> => {
    return ApplicationModel.find({ organization: organizationId }).populate('user', '_id name role').populate('supervisor', '_id name role').exec();
}

export const getApplicationByUserId = (userId: string): Promise<IApplication[]> => {
    return ApplicationModel.find({ user: userId }).populate('supervisor').exec();
}
