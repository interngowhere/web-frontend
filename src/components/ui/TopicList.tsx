import fetcher from '@/lib/fetcher';
import { TopicResponse, TopicViewType } from '@/types/Topics';
import { useQuery } from '@tanstack/react-query';
import TopicItem from './TopicItem';

function TopicList() {
    const { isPending, error, data } = useQuery({
        queryKey: ['topicList'],
        queryFn: () => fetcher.get('/topics').then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data) {
        return (
            <div className="w-full rounded-md bg-white">
                {(data as TopicResponse).data.map((topic, index) => (
                    <TopicItem topic={topic} key={index} view={TopicViewType.List}/>
                ))}
            </div>
        );
    }
}

export default TopicList;
