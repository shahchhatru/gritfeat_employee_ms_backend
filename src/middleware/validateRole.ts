import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../enums/user-roles.enum';
import CustomError, { errorHandler } from '../utils/Error';

export const allowRoles = (allowedRoles: UserRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals?.user?.role as UserRoles;
    if (!allowedRoles.includes(userRole)) errorHandler(res, new CustomError('User not authorized to access.', 403));
    else next();
  };
};