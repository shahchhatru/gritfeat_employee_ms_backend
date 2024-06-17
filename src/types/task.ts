export interface Task {
    title:string;
    description?:string;
    dueDate:string;
    dueTime:string;
    assigner:string;
    assignees?:string[];
    stage?:string;
    priority?:string;
}

export interface Assigner{
_id?:string;
name?:string
}

export interface TaskwithResponse{
    title:string;
    description?:string;
    dueDate:string;
    dueTime:string;
    assigner:Assigner;
    assignees?:Assigner[];
    stage?:string;
    priority?:string;

}
