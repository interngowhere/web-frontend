import { APIResponse } from "./Api";

export enum ThreadViewType {
    List,
    Detail,
}

// Where user opened the dialog box
export enum NewCommentDialogOriginType {
    Main,
    Comment,
}

interface CommentRequest {
    content: string;
    parentId: number;
}

interface CommentResponse extends APIResponse {
    data: CommentItem[];
}

interface CommentItem {
    id: number;
    parentId: number;
    content: string;
    modifiedAt: string;
    createdByID: string;
    createdByUsername: string;
    createdAt: string;
    kudoCount: number;
    userKudoed: boolean;
    children: CommentItem[];
}

export type { CommentRequest, CommentResponse, CommentItem };
