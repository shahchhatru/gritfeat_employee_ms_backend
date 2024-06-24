import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../../utils/HttpResponse";
import { messages } from "../../../utils/Messages";
import CommentsService from "./service";
import ActivityService from "../Activity/service";

const CommentController = {
    async createComment(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const user = res.locals.user;
            console.log({ user })

            const result = await CommentsService.createComment({ ...body, author: user._id })

            // await ActivityService.createActivityLog(user._id,user.name,messages.comments.creation_success);
            return successResponse({
                response: res,
                message: messages.comments.creation_success,
                data: result,
                status: 201,
            })

        }
        catch (error) {
            next(error)
        }
    },

    async getCommentByTaskId(req: Request, res: Response, next: NextFunction) {
        try {
            const { applicationId } = req.params;
            const comments = await CommentsService.getCommentsByApplicationId(applicationId);
            return successResponse({
                response: res,
                message: messages.comments.get_all_success,
                data: comments,
                status: 200
            })
        }
        catch (error) {
            next(error)
        }
    },

    async updateComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const body = req.body;
            const user = res.locals.user;
            const comment = await CommentsService.checkCommentForUpdate(id, user._id, messages.actions.forbidden_message);
            const result = await CommentsService.updateComment(id, comment.author, body);
            return successResponse({
                response: res,
                message: messages.comments.edit_success,
                data: result,
                status: 201,
            })
        }
        catch (error) {
            next(error)
        }
    },

    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = res.locals.user;
            await CommentsService.checkCommentForUpdate(id, user._id, messages.actions.forbidden_message);
            await CommentsService.deleteComment(id);
            return successResponse({
                response: res,
                message: messages.comments.deletion_success,
                data: { message: `comment with ID ${id} deleted successfully` },
                status: 201,
            })
        }
        catch (error) {
            next(error)
        }
    },

    async getCommentbyId(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const comment = await CommentsService.getCommentById(id);
        return successResponse({
            response: res,
            message: messages.comments.get_all_success,
            data: comment,
            status: 200
        })
    }
}


export default CommentController;