interface ListTopicResponse {
    message: string;
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

export type { ListTopicResponse, TopicItem };
