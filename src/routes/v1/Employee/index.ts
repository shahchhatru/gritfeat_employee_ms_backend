import { Router } from 'express';
import EmployeeController from './controller';

const employeeRouter = Router();

employeeRouter.route('/').get(EmployeeController.getALLEmployees);
employeeRouter.route('/:id').get(EmployeeController.getEmployeeById);
employeeRouter.route('/:id').patch(EmployeeController.updateEmployee);
employeeRouter.route('/:id').delete(EmployeeController.deleteEmployee);
export default employeeRouter