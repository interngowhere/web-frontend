import { TagItem } from './Tags';
import { APIResponse } from "./Api";

export enum ThreadViewType {
    List,
    Detail,
}

interface ThreadResponse extends APIResponse {
    data: ThreadItem[];
}

interface ThreadItem {
    id: number;
    title: string;
    slug: string;
    topicSlug: string;
    description: string;
    modifiedAt: string;
    createdByID: string;
    createdByUsername: string;
    createdAt: string;
    tags: TagItem[];
    kudoCount: number;
    userKudoed: boolean;
}

export type { ThreadResponse, ThreadItem };
