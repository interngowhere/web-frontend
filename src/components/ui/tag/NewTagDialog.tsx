import { Dialog, DialogContent, DialogTrigger } from '@/components/primitives/Dialog';
import fetcher from '@/lib/fetcher';
import { APIResponse } from '@/types/Api';
import { TagRequest } from '@/types/Tags';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../../primitives/Button';
import Input from '../../primitives/Input';

export default function NewTagDialog() {
    const [tagName, setTagName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newTag: TagRequest) => {
            return fetcher.post('/tags', newTag);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            if (res.code === 409) {
                setError('Tag already exist');
                return;
            }
            toast.error(`Something unexpected happened: ${res.message}`);
        },
        onSuccess: (data: AxiosResponse, variables) => {
            setTagName('');
            if (data.status === 201) {
                queryClient.setQueryData(['tagList', { tagName: variables.tagName }], data);
                setOpen(false);

                // Show toast
                toast.success(`Tag created successfully!`);
            } else {
                toast(`Something unexpected happened: ${data.data.message}`);
            }
        },
    });

    function onSubmit() {
        if (tagName.length > 50) {
            setError('Please choose a shorter tag name (maximum 50 characters)');
            return;
        }
        setError(null);
        mutation.mutate({ tagName: tagName });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <PlusIcon className="mr-1 h-4 w-4" />
                    New Tag
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h1 className="text-xl font-bold">Create a new tag</h1>
                <div className="flex flex-col gap-1">
                    <Input
                        placeholder="e.g. amazon cloud services, web development, etc."
                        className="text-sm"
                        onChange={(e) => {
                            setTagName(e.target.value);
                        }}
                    />
                    <span className="text-sm font-medium text-destructive">{error}</span>
                </div>

                <Button
                    className="ml-auto w-full max-w-28"
                    variant="primary"
                    disabled={tagName.length == 0}
                    onClick={() => onSubmit()}
                >
                    Add
                </Button>
            </DialogContent>
        </Dialog>
    );
}
