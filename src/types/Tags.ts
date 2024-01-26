import { APIResponse } from "./Api";

interface TagRequest {
    tagName: string;
}

interface TagResponse extends APIResponse {
    data: TagItem[];
}

interface TagItem {
    id: number;
    tagName: string;
}

export type { TagRequest, TagResponse, TagItem };
