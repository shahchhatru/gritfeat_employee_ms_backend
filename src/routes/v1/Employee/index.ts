import { Router } from 'express';
import EmployeeController from './controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';
const employeeRouter = Router();
employeeRouter.use(deSerializeUser)
employeeRouter.use(requireUser)
employeeRouter.route('/').get(EmployeeController.getALLEmployees);
employeeRouter.route('/').post(EmployeeController.createEmployee);
employeeRouter.route('/:id').get(EmployeeController.getEmployeeById);
employeeRouter.route('/:id').patch(EmployeeController.updateEmployee);
employeeRouter.route('/:id').delete(EmployeeController.deleteEmployee);
export default employeeRouter