import fetcher from '@/lib/fetcher';
import { TopicResponse, TopicViewType } from '@/types/Topics';
import { useQuery } from '@tanstack/react-query';
import TopicItem from './TopicItem';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

function TopicList(props: { searchQuery: string }) {
    const { isPending, error, data } = useQuery({
        queryKey: ['topicList'],
        queryFn: () => fetcher.get('/topics').then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) {
        if (!(error as AxiosError).response) {
            toast.error('Unable to connect to server. Please try again later.');
            return <div>An error occured</div>;
        }
        toast.error(`Something unexpected happened: ${error.message}`);
        return 'An error has occurred: ' + error.message;
    }

    if (data) {
        // filter by search param
        const filteredData = (data as TopicResponse).data.filter((topic) => topic.title.toLowerCase().includes((props.searchQuery || "").toLowerCase()))

        return (
            <div className="w-full rounded-md bg-white">
                {filteredData.map((topic, index) => (
                    <TopicItem topic={topic} key={index} view={TopicViewType.List}/>
                ))}
            </div>
        );
    }
}

export default TopicList;
