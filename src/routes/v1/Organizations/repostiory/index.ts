import { OrganizationDocument, OrganizationModel } from "../../../../models/organization";
import { Organization } from "../../../../types/organizations";


export const createOrganization = (orgData: Organization): Promise<OrganizationDocument> => {
    const organization = new OrganizationModel(orgData);
    return organization.save();
}


export const getAllOrganizations = (): Promise<OrganizationDocument[]> => {
    return OrganizationModel.find({});
}


export const getOrganizationById = (id: string): Promise<OrganizationDocument | null> => {
    return OrganizationModel.findById(id);
}

export const getOrganizationByEmail = (email: string): Promise<OrganizationDocument | null> => {
    return OrganizationModel.findOne({ email: email });
}

export const getOrganizationByLinkedin = (linkedin: string): Promise<OrganizationDocument | null> => {
    return OrganizationModel.findOne({ linkedIn: linkedin });
}


export const deleteOrganizationById = (id: string): Promise<OrganizationDocument | null> => {
    return OrganizationModel.findByIdAndDelete(id);
}


export const updateOrganizationById = (id: string, orgData: Organization): Promise<OrganizationDocument | null> => {
    return OrganizationModel.findByIdAndUpdate(id, orgData, { new: true });
}


