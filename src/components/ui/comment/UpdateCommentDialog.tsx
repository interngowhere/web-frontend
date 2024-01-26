import { Dialog, DialogContent, DialogTrigger } from '@/components/primitives/Dialog';
import fetcher from '@/lib/fetcher';
import { APIResponse } from '@/types/Api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../../primitives/Button';
import Textarea from '../../primitives/TextArea';

interface UpdateCommentDialogProps {
    threadID: string;
    commentID: number;
    content: string;
}

export default function UpdateCommentDialog(props: UpdateCommentDialogProps) {
    const [comment, setComment] = useState<string>(props.content);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () => {
            return fetcher.put(`/threads/${props.threadID}/comments/${props.commentID}`, { content: comment });
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            if (res.code === 404) {
                toast.error(`Comment does not exists`);
                return;
            }
            toast.error(`Something unexpected happened: ${res.message}`);
        },
        onSuccess: (data: AxiosResponse) => {
            setComment('');
            if (data.status === 200) {
                setOpen(false);

                // Show toast
                toast.success(`Comment update successfully!`);

                // Refresh page
                navigate(0);
            } else {
                toast(`Something unexpected happened: ${data.data.message}`);
            }
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex w-full place-items-center gap-2 text-left text-sm">
                    <PencilIcon size={16} color="#030712" />
                    Edit
                </button>
            </DialogTrigger>
            <DialogContent>
                <h1 className="text-xl font-bold">Comment</h1>
                <div className="flex flex-col gap-1">
                    <Textarea
                        placeholder="Write your comment here"
                        className="h-[calc(20vh)] text-sm"
                        value={comment}
                        onChange={(e) => {
                            setComment(e.target.value);
                        }}
                    />
                </div>

                <Button
                    className="ml-auto w-full max-w-28"
                    variant="primary"
                    disabled={comment.length == 0}
                    onClick={() => mutation.mutate()}
                >
                    Update
                </Button>
            </DialogContent>
        </Dialog>
    );
}
