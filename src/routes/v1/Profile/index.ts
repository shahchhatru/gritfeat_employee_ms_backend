import { Router } from 'express';
import ProfileController from './controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';
const ProfileRouter = Router();
ProfileRouter.use(deSerializeUser)
ProfileRouter.use(requireUser)
ProfileRouter.route('/').get(ProfileController.getProfile);
ProfileRouter.route('/all').get(ProfileController.getALLProfiles);
ProfileRouter.route('/').patch(ProfileController.updateProfile);
ProfileRouter.route('/').delete(ProfileController.deleteProfile);
export default ProfileRouter;