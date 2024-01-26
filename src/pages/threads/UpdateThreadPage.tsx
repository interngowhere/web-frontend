import { NavBarWrapper } from '@/components/layout/wrappers';
import { Button } from '@/components/primitives/Button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/primitives/Form';
import Input from '@/components/primitives/Input';
import Textarea from '@/components/primitives/TextArea';
import NewTagDialog from '@/components/ui/tag/NewTagDialog';
import TagInput from '@/components/ui/tag/TagInput';
import { UpdateThreadContext } from '@/context';
import fetcher from '@/lib/fetcher';
import { APIResponse } from '@/types/Api';
import { ListItem } from '@/types/List';
import { TagItem, TagResponse } from '@/types/Tags';
import { ThreadRequest } from '@/types/Threads';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    title: z
        .string({
            required_error: 'Please provide a title for the thread.',
        })
        .min(2, { message: 'Title must be at least 2 characters long' })
        .max(50, { message: 'Title can be at most 50 characters long' }),
    description: z
        .string({
            required_error: 'Please provide a description.',
        })
        .min(20, { message: 'Description must be at least 20 characters long' })
        .max(4096, { message: 'Maximum length of description reached' }),
});

export default function UpdateThreadPage() {
    return (
        <NavBarWrapper>
            <div className="flex min-h-[calc(100vh-3.5rem)] w-full place-content-center place-items-center bg-gray-200">
                <div className="m-6 flex w-full max-w-[--max-width] flex-col rounded-xl bg-white p-8 shadow md:m-12">
                    <div className="flex gap-4">
                        <h3 className="mb-6 text-2xl font-bold">Update thread</h3>
                    </div>
                    <UpdateThreadForm />
                </div>
            </div>
        </NavBarWrapper>
    );
}

// TagToList is a utility function that converts TagItem[] to ListItem[]
function TagToList(tags: TagItem[]) {
    const list = [] as ListItem[];
    if (tags) {
        tags.map((tag) => {
            const id = tag.id.toString();
            const name = tag.tagName;
            list.push({ label: name, value: id });
        });
    }
    return list;
}

function UpdateThreadForm() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // useContext hook stores thread info for updating
    const { threadInfoToUpdate } = useContext(UpdateThreadContext);
    const [selectedTags, setSelectedTags] = useState<ListItem[]>([]);
    const [tags, setTags] = useState<ListItem[]>([]);

    const tagData = useGetList('tagList', '/tags');

    // useMemo to prevent infinite rendering loop. React will only rerender
    // if the data fetched from the hook is different from the current state
    useMemo(() => {
        tagData
            ? setTags(
                  (tagData as TagResponse).data.map((tag) => ({
                      label: tag.tagName,
                      value: tag.id.toString(),
                  })),
              )
            : setTags([]);
    }, [tagData]);

    const mutation = useMutation({
        mutationFn: (threadInfo: ThreadRequest) => {
            return fetcher.put(`/threads/${threadInfoToUpdate.id}`, threadInfo);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            if (res.code === 404) {
                toast.error(`Thread does not exist`);
                return;
            }
            toast.error(`Something unexpected happened: ${res.message}`);
        },
        onSuccess: (data: AxiosResponse) => {
            if (data.status === 200) {
                // Show toast
                toast.success(`Thread updated successfully!`);
                navigate(`/threads/${threadInfoToUpdate.id}/${threadInfoToUpdate.slug}`);
            } else {
                toast(`Something unexpected happened: ${data.data.message}`);
            }
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('submitting');
        const data = {
            ...values,
            tags: selectedTags.map((tag) => Number(tag.value)),
        } as ThreadRequest;
        console.log(data);
        mutation.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="title"
                    defaultValue={threadInfoToUpdate.title}
                    render={({ field }) => (
                        <FormItem>
                            <div className="mb-2 flex flex-col">
                                <FormLabel className="text-lg">Title</FormLabel>
                                <span className="text-sm text-muted-foreground">
                                    What do you want to talk about?
                                </span>
                            </div>
                            <FormControl>
                                <Input placeholder="e.g. Thoughts" {...field} className="text-sm" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <div className="mb-2 flex flex-col">
                        <FormLabel className="text-lg">Tags</FormLabel>
                        <span className="text-sm text-muted-foreground">
                            Add tags associated with your thread
                        </span>
                    </div>
                    <div className="flex place-content-between">
                        <TagInput
                            tags={tags}
                            defaultTags={TagToList(threadInfoToUpdate.tags)}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                        />
                        <NewTagDialog />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    defaultValue={threadInfoToUpdate.description}
                    render={({ field }) => (
                        <FormItem>
                            <div className="mb-2 flex flex-col">
                                <FormLabel className="text-lg">Description</FormLabel>
                                <span className="text-sm text-muted-foreground">
                                    Give a detailed description of your thread
                                </span>
                            </div>
                            <FormControl>
                                <Textarea
                                    className="h-[calc(20vh)]"
                                    placeholder="e.g. this is a place for interested"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="ml-auto w-full max-w-48" type="submit" variant="primary">
                    Update Thread
                </Button>
            </form>
        </Form>
    );
}

function useGetList(queryKey: string, queryURL: string) {
    const { isPending, error, data } = useQuery({
        queryKey: [queryKey],
        queryFn: () => fetcher.get(queryURL).then((res) => res.data),
    });

    if (isPending) return;

    if (error) {
        if (!(error as AxiosError).response) {
            toast.error('Unable to connect to server. Please try again later.');
            return;
        }
        toast.error(`Something unexpected happened: ${error.message}`);
        return;
    }

    if (data) return data;
}
