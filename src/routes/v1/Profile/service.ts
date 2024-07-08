import CustomError from "../../../utils/Error";
import { messages } from "../../../utils/Messages";
import { Profile } from '../../../types/profile';
import { createProfileRepo, getProfileById, getProfileByUserId, getALLProfiles, updateProfileByUserId, deleteProfileByUserId } from './respository';

const ProfileService = {
    async createProfile(profileData: Profile) {
        const profile = await createProfileRepo(profileData);
        if (!profile) {
            throw new CustomError(messages.profile.creation_failed, 403);
        }
        return profile;
    },

    async getProfileById(id: string) {
        const profile = await getProfileById(id);
        if (!profile) {
            throw new CustomError(messages.profile.not_found, 404);
        }
        return profile;
    },

    async getProfileByUserId(id: string) {
        const profile = await getProfileByUserId(id);
        if (!profile) {
            throw new CustomError(messages.profile.not_found, 404);
        }
        return profile;
    },
    async getALLProfiles() {
        const profiles = await getALLProfiles();
        if (!profiles) {
            throw new CustomError(messages.profile.not_found, 404);
        }
        return profiles;
    },

    async updateProfileByUserId(id: string, data: Partial<Profile>) {

        var profile = await updateProfileByUserId(id, data);
        if (!profile) {
            profile = await this.createProfile({ ...data, user: id });
        }
        return profile;
    },

    async deleteProfileByUserId(id: string) {
        const profile = await deleteProfileByUserId(id);
        if (!profile) {
            throw new CustomError(messages.profile.not_found, 404);
        }
        return profile;
    }



}


export default ProfileService;