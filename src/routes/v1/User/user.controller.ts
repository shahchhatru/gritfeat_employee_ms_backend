import { Response, Request, NextFunction } from 'express';

import { User } from '../../../types/user';
import UserService from './service';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';

const UserController = {
  async createUser(req: Request<unknown, unknown, User>, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await UserService.createUser(body);
      return successResponse({
        response: res,
        message: messages.user.creation_success,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id;
      const result = await UserService.getUser(id)
      return successResponse(
        {
          response: res,
          message: messages.user.user_found_succes,
          data: result,
        }
      )
    } catch (error) {
      next(error);
    }
  },

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getUsers();
      return successResponse({
        response: res,
        message: 'Fetched Users successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUsersNameAndID(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getAllUsersNameandID();
      return successResponse({
        response: res,
        message: 'Fetched Users successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async validateUserWithTemporaryPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, newPassword } = req.body;
      const result = await UserService.verifyUserwithTemporaryPassword(email, password, newPassword);
      return successResponse({
        response: res,
        message: messages.user.user_found_succes,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
};

export default UserController;
