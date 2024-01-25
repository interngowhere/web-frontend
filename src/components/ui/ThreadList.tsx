import fetcher from '@/lib/fetcher';
import { ThreadResponse, ThreadViewType } from '@/types/Threads';
import { useQuery } from '@tanstack/react-query';
import ThreadItem from './ThreadItem';

export default function ThreadList(props: { topicSlug: string | undefined }) {
    const url = props.topicSlug ? `/topics/${props.topicSlug}/threads` : '/threads';

    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['threadList', props.topicSlug],
        queryFn: () => fetcher.get(url).then((res) => res.data),
    });
    url
    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return (
            <div className="w-full rounded-md bg-white">
                {(data as ThreadResponse).data.map((thread, index) => (
                    <ThreadItem thread={thread} view={ThreadViewType.List} key={index} />
                ))}
            </div>
        );
    }
}
