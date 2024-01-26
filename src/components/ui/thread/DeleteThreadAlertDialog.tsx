import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/primitives/AlertDialog';
import { Trash2Icon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import fetcher from '@/lib/fetcher';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { APIResponse } from '@/types/Api';
import { useNavigate } from 'react-router-dom';

export default function DeleteThreadAlertDialog(props: { threadID: number }) {
    const navigate = useNavigate();

    // convert threadID to string
    const threadID = props.threadID.toString();

    // delete mutation method
    const mutation = useMutation({
        mutationFn: () => {
            return fetcher.delete(`/threads/${threadID}`);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            if (res.code === 404) {
                toast.error(`Thread does not exist or has already been deleted`);
                return;
            }
            toast.error(`Something unexpected happened: ${res.message}`);
        },
        onSuccess: (data: AxiosResponse) => {
            if (data.status === 200) {
                // Show toast
                toast.success(`Thread deleted successfully!`);

                // Refresh page
                navigate("/threads")
                navigate(0)
            } else {
                toast(`Something unexpected happened: ${data.data.message}`);
            }
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex w-full place-items-center gap-2 text-left text-sm">
                    <Trash2Icon size={16} color="#030712" />
                    Delete
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this thread?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action is irreversible
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutation.mutate()}>Delete Thread</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
