
 interface Comment{
    content:string;
    author:string;
    task:string;
}

export interface CommentResponse{
    content:string;
    author:{
        _id:string;
        name:string;
    };
    task:{
        _id:string;
        title:string;
    };
}


export default Comment;

