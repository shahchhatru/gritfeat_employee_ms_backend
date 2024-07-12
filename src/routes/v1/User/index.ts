import { Router } from 'express';
import UserController from './user.controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';
import OTPRouter from '../OTP';

const UserRouter = Router();

// Apply middleware
UserRouter.use(deSerializeUser);
// UserRouter.use(requireUser);
// Routes for user actions
UserRouter.route('/name').get(requireUser, UserController.getUsersNameAndID);
UserRouter.route('/verifytempusers').post(requireUser, UserController.validateUserWithTemporaryPassword);

// Routes for users
UserRouter.route('/').get(requireUser, UserController.getUsers);
UserRouter.route('/all').get(requireUser, UserController.getAllUserByOrganizationID);
UserRouter.route('/').post(requireUser, UserController.createUser);

// Routes for specific user
UserRouter.route('/:id').get(requireUser, UserController.getUser);
UserRouter.route('/:id').patch(requireUser, UserController.updateUser);

// OTP Router

UserRouter.use('/:userId/otp', OTPRouter);

export default UserRouter;
