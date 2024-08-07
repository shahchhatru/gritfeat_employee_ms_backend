import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../../utils/HttpResponse";
import { messages } from "../../../utils/Messages";
import SalaryService from "./service";
import CustomError from "../../../utils/Error";

const SalaryController = {

    async createSalary(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (!user._id) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 404);

            const currentDate = new Date();
            const monthIndex = currentDate.getMonth(); // getMonth returns 0-11
            const year = currentDate.getFullYear().toString();

            const months = [
                "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
            ];

            const month = months[monthIndex];

            const salary = await SalaryService.createSalary({
                ...body,
                organization: user.organization,
                month,
                year,
            });

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
            const salaries = await SalaryService.getSalaryByOrg(organization);
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
            const salaries = await SalaryService.getSalaryByUser(user);
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
            const salaries = await SalaryService.getAllSalaryByUserAndMonth(user?.toString(), month?.toString());
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
            const salaries = await SalaryService.getAllSalaryByUserAndYear(user.toString(), year.toString());
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
            const salaries = await SalaryService.getAllSalaryUserYearAndMonth(user.toString(), year.toString(), month.toString());
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
            console.log({ user, month, year })

            let salaries;

            if (year && month) {
                // Fetch salaries for user, year, and month
                salaries = await SalaryService.getAllSalaryUserYearAndMonth(user.toString(), year.toString(), month.toString());
            } else if (year) {
                // Fetch salaries for user and year
                salaries = await SalaryService.getAllSalaryByUserAndYear(user.toString(), year.toString());
            } else if (month) {
                // Fetch salaries for user and month
                salaries = await SalaryService.getAllSalaryByUserAndMonth(user.toString(), month.toString());
            } else {
                throw new CustomError('Invalid query parameters', 400); // Handle invalid query scenarios
            }

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
