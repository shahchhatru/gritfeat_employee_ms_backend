import { Router } from 'express';
import Health from './Health';
import UserRouter from './User';
import AuthRouter from './Auth';
import TaskRouter from './Task';
import ActivityRouter from './Activity';
import CommentRouter from './Comments';
import OrganizationRouter from './Organizations';
import ProfileRouter from './Profile'
import EmployeeRouter from './Employee';
import ApplicationRouter from './Applications';
import SalaryRouter from './Salary';
import attendenceRouter from './Attendence';

const router = Router();
router.use('/users', UserRouter);

router.use('/health', Health);

router.use("/auth", AuthRouter);
router.use('/tasks', TaskRouter);
router.use('/activities', ActivityRouter);
router.use('/comments', CommentRouter);
router.use('/organizations', OrganizationRouter);
router.use('/profile', ProfileRouter);
router.use('/employee', EmployeeRouter);
router.use('/applications', ApplicationRouter);
router.use('/salary', SalaryRouter);
router.use('/attendence', attendenceRouter);
/**
 * Import and add your routes here
 * Eg:
 *   router.use('/[route-name]', [Route]);
 */

export default router;
