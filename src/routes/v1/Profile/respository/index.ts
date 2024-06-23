import { Profile } from '../../../../types/profile';
import { ProfileDocument, ProfileModel } from '../../../../models/profile';

export const createProfileRepo = (profileData: Profile): Promise<ProfileDocument> => {
    const profile = new ProfileModel(profileData);
    return profile.save();
}


export const getProfileById = (id: string): Promise<ProfileDocument | null> => {
    return ProfileModel.findById(id)
}


export const updateProfile = async (id: string, profileData: Partial<Profile>): Promise<ProfileDocument | null> => {
    return ProfileModel.findByIdAndUpdate(id, profileData, { new: true });
}


export const deleteProfileById = async (id: string): Promise<ProfileDocument | null> => {
    return ProfileModel.findByIdAndDelete(id);
}

export const getALLProfiles = (): Promise<ProfileDocument[]> => {
    return ProfileModel.find({})
}

export const getProfileByUserId = (id: string) => {
    return ProfileModel.find({ user: id });
}

export const updateProfileByUserId = async (id: string, profileData: Partial<Profile>): Promise<ProfileDocument | null> => {
    return ProfileModel.findOneAndUpdate({ user: id }, profileData, { new: true });
}

export const deleteProfileByUserId = async (id: string): Promise<ProfileDocument | null> => {
    return ProfileModel.findOneAndDelete({ user: id })
}