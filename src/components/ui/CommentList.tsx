import fetcher from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { ThumbsUpIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CommentList(props: { threadId: string | undefined }) {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['commentList'],
        queryFn: () => fetcher.get(`/threads/${props.threadId}/comments`).then((res) => res.data),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (isFetching) return 'Updating...';

    if (data) {
        console.log(data);
        return (
            <div></div>
            // <div className="w-full rounded-md bg-white">
            //     {(data as ListThreadResponse).data.map((thread, index) => (
            //         <CommentItem thread={thread} view={ThreadViewType.List} key={index} />
            //     ))}
            // </div>
        );
    }
}

// function CommentItem() {
//     const navigate = useNavigate();
//     const [didUserKudo, setDidUserKudo] = useState(props.thread.userKudoed || false);
//     const [kudoCount, setKudoCount] = useState(props.thread.kudoCount || 0);

//     return (
//         <div className="flex flex-col border-b p-2 last:border-0">
//             <div className="flex">
//                 <div className="flex flex-col place-items-center pr-4 pt-2">
//                     <ThumbsUpIcon
//                         size={24}
//                         fill={didUserKudo ? '#FF5038' : '#ffffff'}
//                         color={didUserKudo ? '#FF5038' : '#a0aec0'}
//                         className="cursor-pointer duration-150 ease-in-out hover:text-brand-400"
//                         onClick={() => {
//                             if (didUserKudo) {
//                                 setDidUserKudo(false);
//                                 setKudoCount(kudoCount - 1);
//                             } else {
//                                 setDidUserKudo(true);
//                                 setKudoCount(kudoCount + 1);
//                             }
//                         }}
//                     />
//                     <span className="text-xs">{kudoCount}</span>
//                 </div>
//                 <div className="flex flex-col">
//                     <span
//                         className="cursor-pointer text-2xl font-semibold hover:underline"
//                         onClick={() => navigate(`/threads/${props.thread.id}/${props.thread.slug}`)}
//                     >
//                         {props.thread.title}
//                     </span>
//                     {props.view === ThreadViewType.Detail ? (
//                         <span className="text-sm">{props.thread.description}</span>
//                     ) : (
//                         <div className="relative flex">
//                             <span className="text-sm">{props.thread.description}</span>
//                             <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent" />
//                         </div>
//                     )}
//                     <div className="flex gap-2 pt-2">
//                         <TagList thread={props.thread} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
