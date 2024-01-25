import { APIResponse } from "./Api";

export enum TopicViewType {
    List,
    Detail,
}

interface TopicResponse extends APIResponse {
    data: TopicItem[];
}

interface TopicItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    profilePicURL: string;
    createdAt: string;
}

export type { TopicResponse, TopicItem };
