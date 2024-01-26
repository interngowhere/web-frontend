import { Dialog, DialogContent, DialogTrigger } from '@/components/primitives/Dialog';
import { LoginContext } from '@/context';
import fetcher from '@/lib/fetcher';
import { APIResponse } from '@/types/Api';
import { CommentRequest, NewCommentDialogOriginType } from '@/types/Comments';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ReplyIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../../primitives/Button';
import Textarea from '../../primitives/TextArea';

interface NewCommentDialogProps {
    parentID: number;
    threadID: string;
    openFrom: NewCommentDialogOriginType;
}

export default function NewCommentDialog(props: NewCommentDialogProps) {
    const [comment, setComment] = useState<string>('');
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (newComment: CommentRequest) => {
            return fetcher.post(`/threads/${props.threadID}/comments`, newComment);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            toast.error(`Something unexpected happened: ${res.message}`);
        },
        onSuccess: (data: AxiosResponse) => {
            setComment('');
            if (data.status === 201) {
                setOpen(false);

                // Show toast
                toast.success(`Comment created successfully!`);

                // Refresh page
                navigate(0);
            } else {
                toast(`Something unexpected happened: ${data.data.message}`);
            }
        },
    });

    function onSubmit() {
        const requestBody = {
            content: comment,
            parentId: props.parentID,
        } as CommentRequest;
        mutation.mutate(requestBody);
    }

    // Check if user is authenticated, if not redirect to login page
    const { loggedIn, setLoggedIn } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);

    fetcher.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');

    const checkAuthentication = async () => {
        try {
            const response = await fetcher.post('/ping');
            if (response.status === 200) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            setLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild onClick={() => checkAuthentication()}>
                    {props.openFrom == NewCommentDialogOriginType.Main ? (
                        <div className="flex w-full cursor-text rounded-md border border-gray-300 px-4 py-2 text-gray-500">
                            Write your comment here
                        </div>
                    ) : (
                        <Button variant="ghost" className="w-40 justify-start text-gray-600">
                            <ReplyIcon className="mr-2 h-6 w-6" />
                            Reply
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent>Checking user authentication...</DialogContent>
            </Dialog>
        );
    } else if (loggedIn) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild onClick={() => checkAuthentication()}>
                    <div className="flex w-full cursor-text rounded-md border border-gray-300 px-4 py-2 text-gray-500">
                        Write your comment here
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <h1 className="text-xl font-bold">Comment</h1>
                    <div className="flex flex-col gap-1">
                        <Textarea
                            placeholder="Write your comment here"
                            className="h-[calc(20vh)] text-sm"
                            onChange={(e) => {
                                setComment(e.target.value);
                            }}
                        />
                    </div>

                    <Button
                        className="ml-auto w-full max-w-28"
                        variant="primary"
                        disabled={comment.length == 0}
                        onClick={() => onSubmit()}
                    >
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
        );
    } else {
        toast.error('Please log in to continue');
        navigate('/login');
        return null;
    }
}
