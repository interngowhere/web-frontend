import fetcher from '@/lib/fetcher';
import { ListThreadResponse, ThreadViewType } from '@/types/Threads';
import { useQuery } from '@tanstack/react-query';

import ThreadItem from './ThreadItem';

export default function ThreadList() {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['threadList'],
        queryFn: () => fetcher.get('/threads').then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return (
            <div className="w-full rounded-md bg-white">
                {(data as ListThreadResponse).data.map((thread, index) => (
                    <ThreadItem thread={thread} view={ThreadViewType.List} key={index} />
                ))}
            </div>
        );
    }
}
