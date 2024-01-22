interface ListTagResponse {
    message: string;
    data: TagItem[];
}

interface TagItem {
    id: number;
    tagName: string;
}

export type { ListTagResponse, TagItem };
