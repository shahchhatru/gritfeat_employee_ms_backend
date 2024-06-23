import { Response, Request, NextFunction } from 'express';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { Employee } from '../../../types/employee';
import EmployeeService from './service';

const EmployeeController = {

    async createEmployee(req: Request<unknown, unknown, Employee>, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const result = await EmployeeService.createEmployee(body);
            return successResponse({
                response: res,
                message: messages.employee.creation_success,
                data: result,
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
                }
            )
        } catch (error) {
            next(error);
        }
    },
    async getALLEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await EmployeeService.getALLEmployees();
            return successResponse({
                response: res,
                message: messages.employee.all_get_success,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const id: string = req.params.id;
            const body = req.body;
            const result = await EmployeeService.updateEmployeeByUserId(id, body);
            return successResponse({
                response: res,
                message: messages.employee.edit_success,
                data: result,
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
            });
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;