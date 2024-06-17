import { Router } from 'express';
import AuthController from './auth.controller';

const AuthRouter = Router();

// Login
AuthRouter.route('/login').post(AuthController.login);
AuthRouter.route('/refresh').post(AuthController.genRefreshToken);
AuthRouter.route('/sendresetlink').post(AuthController.generatePasswordResetLink);
AuthRouter.route('/resetpassword').post(AuthController.resetPassword)

export default AuthRouter;
