import { Router } from 'express';
import UserController from './user.controller';

const UserRouter = Router();

// Get All the users
UserRouter.route('/').get(UserController.getUsers);
UserRouter.route('/name').get(UserController.getUsersNameAndID);
// Get one user
UserRouter.route('/:id').get(UserController.getUser);

// Create new user
UserRouter.route('/').post(UserController.createUser);
UserRouter.route('/verifytempusers').post(UserController.validateUserWithTemporaryPassword);
UserRouter.patch('/:id', UserController.updateUser);


export default UserRouter;
