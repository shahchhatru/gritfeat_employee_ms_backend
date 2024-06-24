import { Comment } from "../../../types";
import { createComment, deleteComment, getAllComments, getCommentbyId, getCommentByTaskId, getCommentsByAuthorId, updateComment } from "./repository";
import CustomError from "../../../utils/Error";
import { messages } from "../../../utils/Messages";

const CommentService = {
    async createComment(comment: Comment) {
        const cmt = await createComment(comment);
        return cmt;
    },

    async checkCommentForUpdate(id: string, userId: string, message: string) {
        const data = await getCommentbyId(id);
        if (!data) throw new CustomError(messages.comments.errorMessages.not_found, 404);
        console.log("check comment for update 1")
        const authorId = data.author.toString();
        if (authorId !== userId) {
            throw new CustomError(messages.actions.forbidden_message, 403);
        }
        console.log("check comment for update")
        return data;
    }
    ,

    async updateComment(id: string, userId: string, data: Partial<Comment>) {
        await this.checkCommentForUpdate(id, userId, messages.comments.errorMessages.edit_forbidden);
        const res = await updateComment(id, data);
        if (!res) throw new CustomError(messages.comments.errorMessages.edit_forbidden, 404);
        return res;
    },

    async deleteComment(id: string) {
        // await this.checkCommentForUpdate(id,userId,messages.actions.forbidden_message);
        const res = await deleteComment(id);
        return res;

    },

    async getCommentById(id: string) {
        const comment = await getCommentbyId(id);
        if (!comment) throw new CustomError(messages.comments.errorMessages.not_found, 404);
        return comment;
    },

    async getAllComments() {
        const comments = await getAllComments();
        return comments;
    },

    async getCommentsByApplicationId(taskId: string) {
        const comments = await getCommentByTaskId(taskId);
        if (!comments) throw new CustomError(messages.comments.errorMessages.not_found, 404);
        return comments;
    }
    ,

    async getCommentsByAuthorId(authorId: string) {
        const comments = await getCommentsByAuthorId(authorId);
        return comments;
    }


}


export default CommentService;

