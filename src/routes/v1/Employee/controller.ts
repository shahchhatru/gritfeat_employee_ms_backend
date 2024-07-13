import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { Employee, EmployeeWithUser } from '../../../types/employee';
import EmployeeService from './service';
import CustomError from '../../../utils/Error';
import UserService from '../User/service';
import { User } from '../../../types/user';
import { redisClient } from '../../../config/redisConfig'; // Import the Redis client

const EmployeeController = {

    async createEmployeeWithUser(req: Request<unknown, unknown, EmployeeWithUser>, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            const body = req.body;
            const userData: User = {
                name: body.name,
                email: body.email,
                role: body.role || 'EMPLOYEE',
                password: body.password,
                organizationId: user.organizationId,
            };

            const created_user_data = await UserService.createUserWithValidation(userData);
            const employeeData: Employee = {
                designation: body.designation,
                salary: body.salary,
                user: created_user_data?._id?.toString(),
                skills: body.skills,
                joiningDate: body.joiningDate || new Date().toISOString(),
                organizationId: user.organizationId,
            };

            const result = await EmployeeService.createEmployee(employeeData);

            // Invalidate the cache for all employees
            const cacheKey = `employees:${user.organizationId}`;
            await redisClient.del(cacheKey);

            return successResponse({
                response: res,
                message: messages.employee.creation_success,
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    },

    async createEmployee(req: Request<unknown, unknown, Employee>, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            const body = req.body;
            const result = await EmployeeService.createEmployee(body);

            // Invalidate the cache for all employees
            const cacheKey = `employees:${user.organizationId}`;
            await redisClient.del(cacheKey);

            return successResponse({
                response: res,
                message: messages.employee.creation_success,
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    },

    async getEmployeeById(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const cacheKey = `employee:${id}`;

            // Check if the data is in the cache
            const cachedEmployee = await redisClient.get(cacheKey);
            if (cachedEmployee) {
                return successResponse({
                    response: res,
                    message: messages.employee.all_get_success,
                    data: JSON.parse(cachedEmployee),
                    status: 200,
                });
            }

            const result = await EmployeeService.getEmployeeById(id);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.employee.all_get_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async getALLEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            if (!user.organizationId) throw new CustomError(messages.user.user_not_found, 404);
            const cacheKey = `employees:${user.organizationId}`;

            // Check if the data is in the cache
            const cachedEmployees = await redisClient.get(cacheKey);
            if (cachedEmployees) {
                return successResponse({
                    response: res,
                    message: messages.employee.all_get_success,
                    data: JSON.parse(cachedEmployees),
                    status: 200,
                });
            }

            const result = await EmployeeService.getALLEmployees(user.organizationId);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.employee.all_get_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const body = req.body;
            const user = res.locals.user;
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404);
            if (!user.organizationId) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            const result = await EmployeeService.updateEmployeeByUserId(id, { ...body, organizationId: user.organizationId });

            // Invalidate the cache for the updated employee and all employees in the organization
            const cacheKey = `employee:${id}`;
            await redisClient.del(cacheKey);
            const orgCacheKey = `employees:${user.organizationId}`;
            await redisClient.del(orgCacheKey);

            return successResponse({
                response: res,
                message: messages.employee.edit_success,
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const result = await EmployeeService.deleteEmployeeByUserId(id);

            // Invalidate the cache for the deleted employee and all employees in the organization
            const cacheKey = `employee:${id}`;
            await redisClient.del(cacheKey);
            const orgCacheKey = `employees:${res.locals.user.organizationId}`;
            await redisClient.del(orgCacheKey);

            return successResponse({
                response: res,
                message: messages.employee.delete_success,
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async addBonusAmountByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            console.log({ user });
            if (user.role !== 'ADMIN') {
                if (user.role !== 'SUPERVISOR') {
                    throw new CustomError(messages.actions.forbidden_message + " Only Admin or supervisor can do this task", 403);
                }
            }
            const userId: string = req.params.userId;
            const { bonusAmount } = req.body;
            if (!bonusAmount || typeof bonusAmount !== 'string') {
                throw new CustomError('Invalid bonus amount', 400);
            }
            const employee = await EmployeeService.getEmployeeByUserId(userId);
            if (!employee) {
                throw new CustomError(messages.employee.not_found, 404);
            }
            const result = await EmployeeService.addBonusAmountByUserId(userId, bonusAmount);

            // Invalidate the cache for the employee
            const cacheKey = `employee:${employee._id}`;
            await redisClient.del(cacheKey);
            const AllEmployeecacheKey = `employees:${user.organizationId}`;

            // Invalidate the cache for all employees
            await redisClient.del(AllEmployeecacheKey);
            const bonuscacheKey = `employee:bonus:${userId}`;

            // Check if the data is in the cache
            await redisClient.del(bonuscacheKey);

            return successResponse({
                response: res,
                message: 'Bonus amount added successfully',
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async removeBonusAmountByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role !== 'ADMIN') {
                if (user.role !== 'SUPERVISOR') {
                    throw new CustomError(messages.actions.forbidden_message + " Only Admin or supervisor can do this task", 403);
                }
            }
            const userId: string = req.params.userId;
            const { bonusAmount } = req.body;
            if (!bonusAmount || typeof bonusAmount !== 'string') {
                throw new CustomError('Invalid bonus amount', 400);
            }
            const employee = await EmployeeService.getEmployeeByUserId(userId);
            if (!employee) {
                throw new CustomError(messages.employee.not_found, 404);
            }
            const result = await EmployeeService.removeBonusAmountByUserId(userId, bonusAmount);


            // Invalidate the cache for the employee
            const cacheKey = `employee:${employee._id}`;
            await redisClient.del(cacheKey);
            const AllEmployeecacheKey = `employees:${user.organizationId}`;
            const bonuscacheKey = `employee:bonus:${userId}`;

            // Check if the data is in the cache
            await redisClient.del(bonuscacheKey);
            // Invalidate the cache for all employees
            await redisClient.del(AllEmployeecacheKey);

            return successResponse({
                response: res,
                message: 'Bonus amount removed successfully',
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async getTotalBonusAmountByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = req.params.userId;
            const cacheKey = `employee:bonus:${userId}`;

            // Check if the data is in the cache
            const cachedBonus = await redisClient.get(cacheKey);
            if (cachedBonus) {
                return successResponse({
                    response: res,
                    message: 'Total bonus amount retrieved successfully',
                    data: { totalBonus: JSON.parse(cachedBonus) },
                    status: 200,
                });
            }


            const result = await EmployeeService.getTotalBonusAmountByUserId(userId);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: 'Total bonus amount retrieved successfully',
                data: { totalBonus: result },
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    async clearBonusArrayByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role !== 'ADMIN') {
                if (user.role !== 'SUPERVISOR') {
                    throw new CustomError(messages.actions.forbidden_message + " Only Admin or supervisor can do this task", 403);
                }
            }
            const userId: string = req.params.userId;
            const result = await EmployeeService.clearBonusArrayByUserId(userId);

            // Invalidate the cache for the employee
            const cacheKey = `employee:bonus:${userId}`;
            await redisClient.del(cacheKey);
            const employee = await EmployeeService.getEmployeeByUserId(userId);
            if (!employee) {
                throw new CustomError(messages.employee.not_found, 404);
            }
            // Invalidate the cache for the employee
            const empcacheKey = `employee:${employee._id}`;
            await redisClient.del(empcacheKey);
            const AllEmployeecacheKey = `employees:${user.organizationId}`;

            // Invalidate the cache for all employees
            await redisClient.del(AllEmployeecacheKey);
            const bonuscacheKey = `employee:bonus:${userId}`;

            // Clear if the data is in the cache
            await redisClient.del(bonuscacheKey);

            return successResponse({
                response: res,
                message: 'Bonus array cleared successfully',
                data: result,
                status: 200,
            });
        } catch (error) {
            next(error);
        }
    }
};

export default EmployeeController;
