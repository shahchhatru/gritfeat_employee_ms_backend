import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { Employee, EmployeeWithUser } from '../../../types/employee';
import EmployeeService from './service';
import CustomError from '../../../utils/Error';
import UserService from '../User/service';
import { User } from '../../../types/user';

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
            }
            // const result = await EmployeeService.createEmployeeWithUser({ ...body, organizationId: user.organizationId });
            const created_user_data = await UserService.createUserWithValidation(userData);
            const employeeData: Employee = {
                designation: body.designation,
                salary: body.salary,
                user: created_user_data?._id?.toString(),
                skills: body.skills,
                joiningDate: body.joiningDate || new Date().toISOString(),
                organizationId: user.organizationId

            }

            const result = await EmployeeService.createEmployee(employeeData);

            return successResponse({
                response: res,
                message: messages.employee.creation_success,
                data: result,
                status: 201
            });
        } catch (error) {
            next(error);
        }

    }
    ,
    async createEmployee(req: Request<unknown, unknown, Employee>, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (!user) throw new CustomError(messages.user.user_not_found, 404);
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            const body = req.body;
            const result = await EmployeeService.createEmployee(body);
            return successResponse({
                response: res,
                message: messages.employee.creation_success,
                data: result,
                status: 201
            });
        } catch (error) {
            next(error);
        }
    },
    async getEmployeeById(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const result = await EmployeeService.getEmployeeById(id)
            return successResponse(
                {
                    response: res,
                    message: messages.employee.all_get_success,
                    data: result,
                    status: 200
                }
            )
        } catch (error) {
            next(error);
        }
    },
    async getALLEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;
            if (user.role !== 'ADMIN') throw new CustomError(messages.actions.forbidden_message, 403);
            if (!user.organizationId) throw new CustomError(messages.user.user_not_found, 404);
            const result = await EmployeeService.getALLEmployees(user.organizationId);
            return successResponse({
                response: res,
                message: messages.employee.all_get_success,
                data: result,
                status: 200
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
            return successResponse({
                response: res,
                message: messages.employee.edit_success,
                data: result,
                status: 201
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const result = await EmployeeService.deleteEmployeeByUserId(id);
            return successResponse({
                response: res,
                message: messages.employee.delete_success,
                data: result,
                status: 200
            });
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;