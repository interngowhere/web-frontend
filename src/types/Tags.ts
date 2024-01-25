import { APIResponse } from "./Api";

interface TagResponse extends APIResponse {
    data: TagItem[];
}

interface TagItem {
    id: number;
    tagName: string;
}

export type { TagResponse, TagItem };
