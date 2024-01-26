import { TagItem } from './Tags';
import { APIResponse } from "./Api";

export enum ThreadViewType {
    List,
    Detail,
}

interface ThreadUpdateInfo {
    id: number;
    slug: string;
    title: string;
    description: string;
    tags: TagItem[];
}

interface ThreadRequest {
    topic: string;
    title: string;
    description: string;
    tags: number[];
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

export type { ThreadRequest, ThreadUpdateInfo, ThreadResponse, ThreadItem };
