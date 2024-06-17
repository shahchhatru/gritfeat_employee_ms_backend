import { CommentDocument,CommentModel} from "../../../../models/comments";
import  Comment  from "../../../../types/comments";


export const createComment = (comment: Comment): Promise<CommentDocument> => {
   const cmnt = new CommentModel(comment);
   return cmnt.save();
}



export const getAllComments = (): Promise<CommentDocument[]> => {
  return CommentModel.find({}).exec();
}

export const updateComment = (id: string, data: Partial<Comment>): Promise<CommentDocument | null> => {
  return CommentModel.findByIdAndUpdate(id, data, { new: true }).exec();
};

export const deleteComment = (id: string): Promise<CommentDocument | null> => {
  return CommentModel.findByIdAndDelete(id).exec();
}


export const getCommentbyId = (id: string): Promise<CommentDocument | null> => {
  return CommentModel.findById(id).exec();
}


export const getCommentByTaskId = (task: string): Promise<CommentDocument[]> => {
  return CommentModel.find({ task }).populate('author','_id name').populate('task','_id title').exec();
}


export const getCommentsByAuthorId = (author: string): Promise<CommentDocument[]> => {
    return CommentModel.find({ author }).exec();
}