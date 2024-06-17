import { NextFunction, Request, Response } from 'express';
import { Auth, AuthRefresh, PasswordReset, PasswordResetRequest } from '../../../types/auth';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import AuthService from './service';

const AuthController = {
  async login(req: Request<unknown, unknown, Auth>, res: Response,next:NextFunction) {
    try {
      const body = req.body;
      const result = await AuthService.login(body);
      return successResponse({
        status: 200,
        response: res,
        message: messages.auth.login_success,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },


  async genRefreshToken(req:Request<unknown,unknown,AuthRefresh>,res:Response,next:NextFunction){
    try{
      const body= req.body;
      const result = await AuthService.generateNewToken(body.token);
      return successResponse({
        status:200,
        response:res,
        message:messages.auth.refresh_token_success,
        data:result,
      })
    }
    catch(error){
     next(error)
    }
  }
  ,

  async generatePasswordResetLink(req: Request<unknown, unknown, PasswordResetRequest>, res: Response, next: NextFunction) {
    try {
      const {email} = req.body;
      const result = await AuthService.generatePasswordResetLink(email);
      return successResponse({
        status: 200,
        response: res,
        message: messages.auth.password_reset_link_success,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  ,
  async resetPassword(req: Request<unknown, unknown, PasswordReset>, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      console.log()
      const result = await AuthService.resetPassword(token, password);
      return successResponse({
        status: 200,
        response: res,
        message: messages.auth.password_reset_success,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  ,


};

export default AuthController;
