import {Router } from 'express';
import CommentController from './comments.controller';
import deSerializeUser from '../../../middleware/deSerializeUser';
import requireUser from '../../../middleware/requireUser';
const CommentRouter = Router();
CommentRouter.use(deSerializeUser)
CommentRouter.use(requireUser)
CommentRouter.route('/').post(CommentController.createComment);
CommentRouter.route('/task/:taskId').get(CommentController.getCommentByTaskId);
CommentRouter.route('/:id').get(CommentController.getCommentbyId);
CommentRouter.route('/:id').patch(CommentController.updateComment);
CommentRouter.route('/:id').delete(CommentController.deleteComment);
export default CommentRouter

