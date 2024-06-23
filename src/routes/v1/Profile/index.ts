import { Router } from 'express';
import ProfileController from './controller';
const ProfileRouter = Router();

ProfileRouter.route('/').get(ProfileController.getProfile);
ProfileRouter.route('/all').get(ProfileController.getALLProfiles);
ProfileRouter.route('/').patch(ProfileController.updateProfile);
ProfileRouter.route('/').delete(ProfileController.deleteProfile);
export default ProfileRouter;