import { Response, Request, NextFunction } from 'express';
import { User } from '../../../types/user';
import UserService from './service';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { redisClient } from '../../../config/redisConfig'; // Import the Redis client

const UserController = {
  async createUser(req: Request<unknown, unknown, User>, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      if (!user) throw new Error(messages.user.user_not_found);
      if (user.role !== 'ADMIN') throw new Error(messages.actions.forbidden_message);
      const body = req.body;
      const result = await UserService.createUser({ ...body, organizationId: user.organizationId });
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
      const cacheKey = `user:${id}`;

      // Check if the data is in the cache
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        return successResponse({
          response: res,
          message: messages.user.user_found_succes,
          data: JSON.parse(cachedUser),
        });
      }

      const result = await UserService.getUser(id);

      // Store the result in the cache
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

      return successResponse({
        response: res,
        message: messages.user.user_found_succes,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'users:all';

      // Check if the data is in the cache
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        return successResponse({
          response: res,
          message: 'Fetched Users successfully',
          data: JSON.parse(cachedUsers),
        });
      }

      const result = await UserService.getUsers();

      // Store the result in the cache
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

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
      const cacheKey = 'users:nameAndId';

      // Check if the data is in the cache
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        return successResponse({
          response: res,
          message: 'Fetched Users successfully',
          data: JSON.parse(cachedUsers),
        });
      }

      const result = await UserService.getAllUsersNameandID();

      // Store the result in the cache
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

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
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id;
      const body = req.body;
      const result = await UserService.updateUser(id, body);

      // Invalidate the cache for the updated user
      const cacheKey = `user:${id}`;
      await redisClient.del(cacheKey);

      return successResponse({
        response: res,
        message: messages.user.user_update_succes,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllUserByOrganizationID(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;
      const cacheKey = `users:organization:${user.organizationId}`;

      // Check if the data is in the cache
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        return successResponse({
          response: res,
          message: 'Fetched Users successfully',
          data: JSON.parse(cachedUsers),
        });
      }

      const result = await UserService.getallUserbyOrganizationID(user.organizationId);

      // Store the result in the cache
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

      return successResponse({
        response: res,
        message: 'Fetched Users successfully',
        data: result,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
};

export default UserController;
