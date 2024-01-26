import fetcher from '@/lib/fetcher';
import { CommentResponse, CommentItem, NewCommentDialogOriginType } from '@/types/Comments';
import formatTimestamp from '@/lib/timestamp';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ThumbsUpIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { APIResponse } from '@/types/Api';
import NewCommentDialog from './NewCommentDialog';
import DeleteCommentAlertDialog from './DeleteCommentAlertDialog';
import { LoginContext } from '@/context';
import Cookies from 'js-cookie';
import UpdateCommentDialog from './UpdateCommentDialog';
import { useNavigate } from 'react-router-dom';

export default function CommentList(props: { threadId: string | undefined }) {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['commentList'],
        queryFn: () => fetcher.get(`/threads/${props.threadId}/comments`).then((res) => res.data),
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
    
    const { threadId } = useParams();
    // Get user authentication info
    const { loggedIn } = useContext(LoginContext);
    const userid = Cookies.get('userid');
    
    // Format createdAt datetime
    const createdAtDate = formatTimestamp(props.comment.createdAt)
    
    const addKudo = useMutation({
        mutationFn: (commentID: string) => {
            return fetcher.post(`/threads/${threadId}/comments/${commentID}/kudo`);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            toast.error(`Something unexpected happened: ${res.message}`);

            // rollback optimistic update
            setDidUserKudo(false)
            setKudoCount(kudoCount - 1);
        }
    });

    const removeKudo = useMutation({
        mutationFn: (commentID: string) => {
            return fetcher.delete(`/threads/${threadId}/comments/${commentID}/kudo`);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            toast.error(`Something unexpected happened: ${res.message}`);

            // rollback optimistic update
            setDidUserKudo(true)
            setKudoCount(kudoCount + 1);
        }
    });

    return (
        <div className="flex flex-col border-b last:border-0 gap-4">
            <div className='relative'>
                <div className='flex gap-2 place-items-center'>
                    <span className='font-semibold'>{props.comment.createdByUsername}</span>
                    <span className="text-xs text-gray-600"> replied at {createdAtDate}</span>
                </div>
                {loggedIn && userid == props.comment.createdByID && 
                    <div className="absolute top-0 right-0 flex place-content-end gap-4">
                        <UpdateCommentDialog threadID={threadId!} commentID={props.comment.id} content={props.comment.content}/>
                        <DeleteCommentAlertDialog threadID={threadId!} commentID={props.comment.id} />
                    </div>
                }
                
            </div>
            <span>{props.comment.content}</span>
            <div className='flex gap-4'>
                <div className="flex flex-row place-items-center gap-2">
                    <ThumbsUpIcon
                        size={24}
                        fill={didUserKudo ? '#FF5038' : '#ffffff'}
                        color={didUserKudo ? '#FF5038' : '#000000'}
                        className="cursor-pointer duration-150 ease-in-out hover:text-brand-400"
                        onClick={() => {
                            if (!loggedIn) {
                                toast.error('Please login to continus');
                                navigate("/login")
                                return;
                            }

                            if (didUserKudo) {
                                setDidUserKudo(false);
                                setKudoCount(kudoCount - 1);
                                removeKudo.mutate(props.comment.id as unknown as string);
                            } else {
                                setDidUserKudo(true);
                                setKudoCount(kudoCount + 1);
                                addKudo.mutate(props.comment.id as unknown as string);
                            }
                        }}
                    />
                    <span className="text-xs">{kudoCount}</span>
                </div>
                <NewCommentDialog parentID={props.comment.parentId == 0 ? props.comment.id: props.comment.parentId} threadID={threadId!} openFrom={NewCommentDialogOriginType.Comment} />
            </div>
            <div className='flex flex-col ml-8 pl-4 border-l-2 border-gray-300'>
                {props.comment.children && props.comment.children.map((child, index) => <CommentItem comment={child} key={index}/>)}
            </div>
        </div>
    );
}
