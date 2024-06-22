import { Router } from 'express';

import Health from './Health';
import UserRouter from './User';
import OTPRouter from './OTP';
import AuthRouter from './Auth';
import TaskRouter from './Task';
import ActivityRouter from './Activity';
import CommentRouter from './Comments';
import OrganizationRouter from './Organizations';
const router = Router();
router.use('/health', Health);
router.use('/users', UserRouter);
router.use('/users/:userId/otp', OTPRouter);
router.use("/auth", AuthRouter);
router.use('/tasks', TaskRouter);
router.use('/activities', ActivityRouter);
router.use('/comments', CommentRouter);
router.use('/organizations', OrganizationRouter);
/**
 * Import and add your routes here
 * Eg:
 *   router.use('/[route-name]', [Route]);
 */

export default router;
