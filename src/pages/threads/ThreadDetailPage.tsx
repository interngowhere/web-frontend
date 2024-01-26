import { LayoutWrapper } from '@/components/layout/wrappers';
import SearchBar from '@/components/primitives/SearchBar';
import CommentList from '@/components/ui/CommentList';
import NewCommentDialog from '@/components/ui/NewCommentDialog';
import ThreadItem from '@/components/ui/ThreadItem';
import fetcher from '@/lib/fetcher';
import { NewCommentDialogOriginType } from '@/types/Comments';
import { ThreadResponse, ThreadViewType } from '@/types/Threads';
import { useQuery } from '@tanstack/react-query';
import { UserCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function ThreadDetailPage() {
    const { threadId } = useParams();

    return (
        <LayoutWrapper>
            <div className="flex flex-col">
                <ThreadItemContainer threadId={threadId} />
                <div className="flex w-full flex-col gap-4 py-4 md:px-4">
                    <div className="flex flex-col place-content-between gap-4 xs:flex-row">
                        <span className="text-2xl font-semibold">Comments</span>
                        <SearchBar placeholder="Search comments" className="w-full xs:w-48" />
                    </div>
                    <div className="flex place-items-center gap-4">
                        <UserCircle2 size={32} className="text-gray-600" />
                        <NewCommentDialog parentID={0} threadID={threadId!} openFrom={NewCommentDialogOriginType.Main} />
                    </div>
                    <CommentList threadId={threadId} />
                </div>
            </div>
        </LayoutWrapper>
    );
}

function ThreadItemContainer(props: { threadId: string | undefined }) {
    const { isPending, error, isFetching, data } = useQuery({
        queryKey: ['thread', props.threadId],
        queryFn: () => fetcher.get(`/threads/${props.threadId}`).then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return (
            <ThreadItem thread={(data as ThreadResponse).data[0]} view={ThreadViewType.Detail} />
        );
    }
}
