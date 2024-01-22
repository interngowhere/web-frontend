import { TagItem } from './Tags';

interface ListThreadResponse {
    message: string;
    data: ThreadItem[];
}

interface ThreadItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    modifiedAt: string;
    createdBy: string;
    createdAt: string;
    tags: TagItem[];
    kudoCount: number;
    userKudoed: boolean;
}

export type { ListThreadResponse, ThreadItem };
