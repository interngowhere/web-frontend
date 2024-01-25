import { APIResponse } from "./Api";

export enum ThreadViewType {
    List,
    Detail,
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

export type { CommentResponse, CommentItem };
