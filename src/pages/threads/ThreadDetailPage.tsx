import { LayoutWrapper } from '@/components/layout/wrappers';
import CommentList from '@/components/ui/CommentList';
import ThreadItem from '@/components/ui/ThreadItem';
import fetcher from '@/lib/fetcher';
import { ListThreadResponse, ThreadViewType } from '@/types/Threads';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function ThreadDetailPage() {
    const { threadId } = useParams();

    return (
        <LayoutWrapper>
            <div className="flex flex-col">
                <ThreadItemContainer threadId={threadId} />
                <CommentList threadId={threadId} />
            </div>
        </LayoutWrapper>
    );
}

function ThreadItemContainer(props: { threadId: string | undefined }) {
    const { isPending, error, isFetching, data } = useQuery({
        queryKey: ['threadItem'],
        queryFn: () => fetcher.get(`/threads/${props.threadId}`).then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return (
            <ThreadItem
                thread={(data as ListThreadResponse).data[0]}
                view={ThreadViewType.Detail}
            />
        );
    }
}
