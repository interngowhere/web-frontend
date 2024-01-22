import fetcher from '@/lib/fetcher';
import { ListTopicResponse, TopicItem } from '@/types/Topics';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function TopicListItem(props: { topic: TopicItem }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col border-b p-2 last:border-0">
            <span
                className="cursor-pointer text-2xl font-semibold hover:underline"
                onClick={() => navigate(`/topics/${props.topic.slug}`)}
            >
                {props.topic.title}
            </span>
            <span>{props.topic.shortDescription}</span>
        </div>
    );
}

function TopicList() {
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () => fetcher.get('/topics').then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data) {
        return (
            <div className="w-full rounded-md bg-white">
                {(data as ListTopicResponse).data.map((topic) => (
                    <TopicListItem topic={topic} />
                ))}
            </div>
        );
    }
}

export default TopicList;
