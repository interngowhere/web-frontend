import fetcher from '@/lib/fetcher';
import { CommentResponse, CommentItem } from '@/types/Comments';
import formatTimestamp from '@/lib/timestamp';
import { useQuery } from '@tanstack/react-query';
import { ThumbsUpIcon, ReplyIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../primitives/Button';

export default function CommentList(props: { threadId: string | undefined }) {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['commentList'],
        queryFn: () => fetcher.get(`/threads/${props.threadId}/comments`).then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        return (
            <div className="w-full rounded-md bg-white">
                {(data as CommentResponse).data.map((comment, index) => (
                    <CommentItem comment={comment} key={index} />
                ))}
            </div>
        );
    }
}

function CommentItem(props: { comment: CommentItem }) {
    const navigate = useNavigate();
    const [didUserKudo, setDidUserKudo] = useState(props.comment.userKudoed || false);
    const [kudoCount, setKudoCount] = useState(props.comment.kudoCount || 0);

    // Format createdAt datetime
    const createdAtDate = formatTimestamp(props.comment.createdAt)
    console.log(props.comment)
    return (
        <div className="flex flex-col border-b last:border-0 gap-4">
            <div className='flex gap-2 place-items-center'>
                <span className='font-semibold'>{props.comment.createdByUsername}</span>
                <span className="text-xs text-gray-600"> replied at {createdAtDate}</span>
            </div>
            <span className="">{props.comment.content}</span>
            <div className='flex gap-4'>
                <div className="flex flex-row place-items-center gap-2">
                    <ThumbsUpIcon
                        size={24}
                        fill={didUserKudo ? '#FF5038' : '#ffffff'}
                        color={didUserKudo ? '#FF5038' : '#000000'}
                        className="cursor-pointer duration-150 ease-in-out hover:text-brand-400"
                        onClick={() => {
                            if (didUserKudo) {
                                setDidUserKudo(false);
                                setKudoCount(kudoCount - 1);
                            } else {
                                setDidUserKudo(true);
                                setKudoCount(kudoCount + 1);
                            }
                        }}
                    />
                    <span className="text-xs">{kudoCount}</span>
                </div>
                <Button
                    variant="ghost"
                    className="w-40 justify-start text-gray-600"
                    onClick={() => navigate('/topics')}
                >
                    <ReplyIcon className="mr-2 h-6 w-6" />
                    Reply
                </Button>
            </div>
            <div className='flex flex-col ml-8 pl-4 border-l-2 border-gray-300'>
                {props.comment.children && props.comment.children.map((child, index) => <CommentItem comment={child} key={index}/>)}
            </div>
        </div>
    );
}
