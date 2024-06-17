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



export default UserRouter;
