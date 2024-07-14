import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../../utils/HttpResponse";
import { messages } from "../../../utils/Messages";
import SalaryService from "./service";
import CustomError from "../../../utils/Error";
import { redisClient } from "../../../config/redisConfig"; // Import the Redis client
import EmployeeService from "../Employee/service";

const SalaryController = {

    async createSalary(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 404);
            const employee = await EmployeeService.getEmployeeByUserId(body.employee);
            if (!employee._id) throw new CustomError(messages.employee.not_found, 404);
            const currentDate = new Date();
            const month = req.body.month; // getMonth returns 0-11
            const year = req.body.year || currentDate.getFullYear().toString();

            const months = [
                "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
            ];




            // const month = months[monthIndex];

            const existingSalary = await SalaryService.getSalaryByUserMonthAndYear(body.employee, month, year);
            console.log({ existingSalary });
            if (existingSalary.length > 0) {
                throw new CustomError(messages.salary.already_exists, 400);
            }
            const bonus = employee.bonus ? employee.bonus?.reduce((a: number, b: number) => a + b, 0) : 0;
            const netAmount = employee.salary + bonus;

            const salary = await SalaryService.createSalary({
                employee: employee._id.toString(),
                organization: user.organizationId,
                month,
                year,
                baseAmount: employee.salary, // provide default value
                bonus: bonus, // provide default value
                tax: 0, // provide default value
                pf: 0, // provide default value
                netAmount: netAmount, // provide default value
            });

            await EmployeeService.clearBonusArrayByUserId(body.employee);

            // Invalidate the cache for all salaries for the organization
            const orgCacheKey = `salaries:organization:${user.organization}`;
            await redisClient.del(orgCacheKey);

            return successResponse({
                response: res,
                message: messages.salary.creation_success,
                data: salary,
                status: 201
            });
        } catch (error) {
            next(error);
        }
    },

    async getSalariesByOrg(req: Request, res: Response, next: NextFunction) {
        try {
            const organization = res.locals.user.organization;
            if (!organization) throw new CustomError(messages.organization.not_found, 404);

            const cacheKey = `salaries:organization:${organization}`;

            // Check if the data is in the cache
            const cachedSalaries = await redisClient.get(cacheKey);
            if (cachedSalaries) {
                return successResponse({
                    response: res,
                    message: messages.salary.fetch_success,
                    data: JSON.parse(cachedSalaries),
                    status: 200
                });
            }

            const salaries = await SalaryService.getSalaryByOrg(organization);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(salaries), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.salary.fetch_success,
                data: salaries,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getSalariesByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user } = req.params;
            const cacheKey = `salaries:user:${user}`;

            // Check if the data is in the cache
            const cachedSalaries = await redisClient.get(cacheKey);
            if (cachedSalaries) {
                return successResponse({
                    response: res,
                    message: messages.salary.fetch_success,
                    data: JSON.parse(cachedSalaries),
                    status: 200
                });
            }

            const salaries = await SalaryService.getSalaryByUser(user);

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(salaries), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.salary.fetch_success,
                data: salaries,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getSalariesByUserAndMonth(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, month } = req.query;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (!month) throw new CustomError(messages.month.not_found, 404);

            const cacheKey = `salaries:user:${user}:month:${month}`;

            // Check if the data is in the cache
            const cachedSalaries = await redisClient.get(cacheKey);
            if (cachedSalaries) {
                return successResponse({
                    response: res,
                    message: messages.salary.fetch_success,
                    data: JSON.parse(cachedSalaries),
                    status: 200
                });
            }

            const salaries = await SalaryService.getAllSalaryByUserAndMonth(user?.toString(), month?.toString());

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(salaries), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.salary.fetch_success,
                data: salaries,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getSalariesByUserAndYear(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, year } = req.query;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (!year) throw new CustomError(messages.year.missing_entity, 404);

            const cacheKey = `salaries:user:${user}:year:${year}`;

            // Check if the data is in the cache
            const cachedSalaries = await redisClient.get(cacheKey);
            if (cachedSalaries) {
                return successResponse({
                    response: res,
                    message: messages.salary.fetch_success,
                    data: JSON.parse(cachedSalaries),
                    status: 200
                });
            }

            const salaries = await SalaryService.getAllSalaryByUserAndYear(user.toString(), year.toString());

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(salaries), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.salary.fetch_success,
                data: salaries,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getSalariesByUserYearAndMonth(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, year, month } = req.query;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (!year) throw new CustomError(messages.year.missing_entity, 404);
            if (!month) throw new CustomError(messages.month.not_found, 404);

            const cacheKey = `salaries:user:${user}:year:${year}:month:${month}`;

            // Check if the data is in the cache
            const cachedSalaries = await redisClient.get(cacheKey);
            if (cachedSalaries) {
                return successResponse({
                    response: res,
                    message: messages.salary.fetch_success,
                    data: JSON.parse(cachedSalaries),
                    status: 200
                });
            }

            const salaries = await SalaryService.getAllSalaryUserYearAndMonth(user.toString(), year.toString(), month.toString());

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(salaries), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.salary.fetch_success,
                data: salaries,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    },

    async getSalaries(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, month, year } = req.query;


            if (!user) {
                throw new CustomError(messages.user.user_not_found, 404);
            }

            let salaries;
            let cacheKey;


            if (year && month) {

                // Fetch salaries for user, year, and month
                cacheKey = `salaries:user:${user}:year:${year}:month:${month}`;
                salaries = await SalaryService.getAllSalaryUserYearAndMonth(user.toString(), year.toString(), month.toString());
            } else if (year) {
                // Fetch salaries for user and year
                cacheKey = `salaries:user:${user}:year:${year}`;
                salaries = await SalaryService.getAllSalaryByUserAndYear(user.toString(), year.toString());
            } else if (month) {
                // Fetch salaries for user and month
                cacheKey = `salaries:user:${user}:month:${month}`;
                salaries = await SalaryService.getAllSalaryByUserAndMonth(user.toString(), month.toString());
            } else {
                throw new CustomError('Invalid query parameters', 400); // Handle invalid query scenarios
            }

            // Check if the data is in the cache
            const cachedSalaries = await redisClient.get(cacheKey);
            if (cachedSalaries) {
                return successResponse({
                    response: res,

                    message: messages.salary.fetch_success,
                    data: JSON.parse(cachedSalaries),
                    status: 200
                });
            }

            // Store the result in the cache
            await redisClient.set(cacheKey, JSON.stringify(salaries), { EX: 3600 }); // Cache for 1 hour

            return successResponse({
                response: res,
                message: messages.salary.fetch_success,
                data: salaries,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    }

}

export default SalaryController;
