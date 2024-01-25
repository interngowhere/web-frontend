import { ThreadItem, ThreadViewType } from '@/types/Threads';
import { ThumbsUpIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TagList from './TagList';

export default function ThreadItem(props: { thread: ThreadItem; view: ThreadViewType }) {
    const navigate = useNavigate();
    const [didUserKudo, setDidUserKudo] = useState(props.thread.userKudoed || false);
    const [kudoCount, setKudoCount] = useState(props.thread.kudoCount || 0);

    return (
        <div className="flex flex-col border-b p-2 last:border-0">
            <div className="flex">
                <div className="flex flex-col place-items-center pr-4 pt-2">
                    <ThumbsUpIcon
                        size={24}
                        fill={didUserKudo ? '#FF5038' : '#ffffff'}
                        color={didUserKudo ? '#FF5038' : '#a0aec0'}
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
                <div className="flex flex-col">
                    <span
                        className="cursor-pointer text-2xl font-semibold hover:underline"
                        onClick={() => navigate(`/threads/${props.thread.id}/${props.thread.slug}`)}
                    >
                        {props.thread.title}
                    </span>
                    {props.view === ThreadViewType.Detail ? (<span className="text-sm">{props.thread.description}</span>) : (<div className='flex relative'>
                        <span className="text-sm">{props.thread.description}</span>
                        <div className='absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent' />
                    </div>)}
                    <div className="flex gap-2 pt-2">
                        <TagList thread={props.thread} />
                    </div>
                </div>
            </div>
        </div>
    );
}
