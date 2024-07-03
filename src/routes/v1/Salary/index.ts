import Router from 'express'
import SalaryController from './controller'
import deSerializeUser from '../../../middleware/deSerializeUser'
import requireUser from '../../../middleware/requireUser'

const SalaryRouter = Router()
SalaryRouter.use(deSerializeUser);
SalaryRouter.use(requireUser);
SalaryRouter.route('/').get(SalaryController.getSalariesByOrg);
SalaryRouter.route('/').post(SalaryController.createSalary);
SalaryRouter.route('/user').get(SalaryController.getSalaries);
SalaryRouter.route('/:user').get(SalaryController.getSalariesByUser);
export default SalaryRouter