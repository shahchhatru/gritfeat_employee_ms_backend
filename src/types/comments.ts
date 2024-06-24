
interface Comment {
    content: string;
    author: string;
    application: string;
}

export interface CommentResponse {
    content: string;
    author: {
        _id: string;
        name: string;
    };
    application: {
        _id: string;
        title: string;
    };
}


export default Comment;

