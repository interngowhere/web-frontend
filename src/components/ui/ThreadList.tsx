import fetcher from '@/lib/fetcher';
import { ListThreadResponse, ThreadItem } from '@/types/Threads';
import { useQuery } from '@tanstack/react-query';
import { ThumbsUpIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function TagList(props: { thread: ThreadItem }) {
    if (props.thread.tags) {
        return props.thread.tags.map((tag) => (
            <span className="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300">
                {tag.tagName}
            </span>
        ));
    } else {
        return null;
    }
}

function ThreadListItem(props: { thread: ThreadItem }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col border-b p-2 last:border-0">
            <div className="flex">
                <div className="flex flex-col place-items-center pr-4 pt-2">
                    <ThumbsUpIcon
                        size={24}
                        className="cursor-pointer duration-150 ease-in-out hover:text-brand-400"
                    />
                    <span className="text-xs">{props.thread.kudoCount}</span>
                </div>
                <div className="flex flex-col">
                    <span
                        className="cursor-pointer text-2xl font-semibold hover:underline"
                        onClick={() => navigate(`/threads/${props.thread.id}/${props.thread.slug}`)}
                    >
                        {props.thread.title}
                    </span>
                    <span className="text-sm">{props.thread.description}</span>
                    <div className="flex gap-2 pt-2">
                        <TagList thread={props.thread} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThreadList() {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['repoData'],
        queryFn: () => fetcher.get('/threads').then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return (
            <div className="w-full rounded-md bg-white">
                {(data as ListThreadResponse).data.map((thread) => (
                    <ThreadListItem thread={thread} />
                ))}
            </div>
        );
    }
}

export default ThreadList;
