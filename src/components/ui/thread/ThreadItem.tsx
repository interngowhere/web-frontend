import { ThreadItem, ThreadViewType } from '@/types/Threads';
import { PencilIcon, ThumbsUpIcon } from 'lucide-react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import formatTimestamp from '@/lib/timestamp';
import TagList from '../tag/TagList';
import { useMutation } from '@tanstack/react-query';
import fetcher from '@/lib/fetcher';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { APIResponse } from '@/types/Api';
import { LoginContext } from '@/context';
import DeleteThreadAlertDialog from './DeleteThreadAlertDialog';
import Cookies from 'js-cookie';
export default function ThreadItem(props: { thread: ThreadItem; view: ThreadViewType }) {
    const navigate = useNavigate();

    const [didUserKudo, setDidUserKudo] = useState(props.thread.userKudoed || false);
    const [kudoCount, setKudoCount] = useState(props.thread.kudoCount || 0);

    // Get user authentication info
    const { loggedIn } = useContext(LoginContext);
    const userid = Cookies.get('userid');

    // Format createdAt datetime
    const createdAtDate = formatTimestamp(props.thread.createdAt)

    // add kudo mutation method
    const addKudo = useMutation({
        mutationFn: (threadID: string) => {
            return fetcher.post(`/threads/${threadID}/kudo`);
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
    
    // remove kudo mutation method
    const removeKudo = useMutation({
        mutationFn: (threadID: string) => {
            return fetcher.delete(`/threads/${threadID}/kudo`);
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
        <div className={`flex flex-col border-b ${props.view == ThreadViewType.Detail ? "pb-4" : "py-4"} last:border-0 border-gray-300`}>
            <div className="flex w-full">
                <div className="flex flex-col place-items-center gap-2 pr-4 pt-4">
                    <ThumbsUpIcon
                        size={24}
                        fill={didUserKudo ? '#FF5038' : '#ffffff'}
                        color={didUserKudo ? '#FF5038' : '#000000'}
                        className="cursor-pointer duration-150 ease-in-out hover:text-brand-400"
                        onClick={() => {
                            if (didUserKudo) {
                                setDidUserKudo(false);
                                setKudoCount(kudoCount - 1);
                                removeKudo.mutate(props.thread.id as unknown as string);
                            } else {
                                setDidUserKudo(true);
                                setKudoCount(kudoCount + 1);
                                addKudo.mutate(props.thread.id as unknown as string);
                            }
                        }}
                    />
                    <span className="text-xs">{kudoCount}</span>
                </div>
                <div className='w-full relative'>
                {loggedIn && userid == props.thread.createdByID && 
                    <div className="absolute top-0 right-0 flex place-content-end gap-4">
                        <button className="flex w-full place-items-center gap-2 text-left">
                            <PencilIcon size={16} color="#030712" onClick={() => navigate("/threads/update")}/>
                            Edit
                        </button>
                        <DeleteThreadAlertDialog threadID={props.thread.id}/>
                    </div>
                }
                <div className="flex flex-col gap-1 w-full">
                    <span 
                        className='cursor-pointer text-gray-600 hover:underline hover:text-black'
                        onClick={() => navigate(`/topics/${props.thread.topicSlug}`)}>
                            /{props.thread.topicSlug}
                    </span>
                    {props.view === ThreadViewType.Detail ? (
                        <span
                            className="text-3xl font-semibold"
                        >
                            {props.thread.title}
                        </span>
                    ) : (
                        <span
                            className="cursor-pointer text-2xl font-semibold hover:underline"
                            onClick={() => navigate(`/threads/${props.thread.id}/${props.thread.slug}`)}
                        >
                            {props.thread.title}
                        </span>
                    )}
                    {props.view === ThreadViewType.Detail ? (
                        <span className="">{props.thread.description}</span>
                    ) : (
                        <div className='flex relative max-h-20'>
                            <span className="text-sm overflow-hidden">{props.thread.description}</span>
                            <div className='absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent' />
                        </div>
                    )}
                    <div className='grid grid-cols-3 gap-4 pt-2'>
                        <div className="flex gap-2 col-span-2">
                            <TagList thread={props.thread} />
                        </div>
                        <div className='text-sm text-gray-600 text-right align-middle'>
                            <span>Posted by <b>{props.thread.createdByUsername}</b> at {createdAtDate}</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
