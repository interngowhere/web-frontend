import { NavBarWrapper } from '@/components/layout/wrappers';
import { Button } from '@/components/primitives/Button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/primitives/Command';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/primitives/Form';
import Input from '@/components/primitives/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/primitives/Popover';
import Textarea from '@/components/primitives/TextArea';
import NewTagDialog from '@/components/ui/NewTagDialog';
import TagInput from '@/components/ui/TagInput';
import fetcher from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { APIResponse } from '@/types/Api';
import { ListItem } from '@/types/List';
import { TagResponse } from '@/types/Tags';
import { ThreadRequest } from '@/types/Threads';
import { TopicResponse } from '@/types/Topics';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { CheckIcon, ChevronDownIcon, PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    topic: z.string({
        required_error: 'Please select a topic.',
    }),
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

export default function NewThreadPage() {
    return (
        <NavBarWrapper>
            <div className="flex min-h-[calc(100vh-3.5rem)] w-full place-content-center place-items-center bg-gray-200">
                <div className="m-6 flex w-full max-w-[--max-width] flex-col rounded-xl bg-white p-8 shadow md:m-12">
                    <div className="flex gap-4">
                        <h3 className="mb-6 text-2xl font-bold">Create a new thread</h3>
                    </div>
                    <NewThreadForm />
                </div>
            </div>
        </NavBarWrapper>
    );
}

function NewThreadForm() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<ListItem[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const mutation = useMutation({
        mutationFn: (newThread: ThreadRequest) => {
            return fetcher.post(`/topics/${newThread.topic}/threads`, newThread);
        },
        onError: (error: AxiosError) => {
            if (!error.response) {
                toast.error('Unable to connect to server. Please try again later.');
                return;
            }
            const res = error.response.data as APIResponse;
            if (res.code === 409) {
                toast.error(`Thread already exists`);
                return;
            }
            toast.error(`Something unexpected happened: ${res.message}`);
        },
        onSuccess: (data: AxiosResponse, variables: ThreadRequest) => {
            if (data.status === 201) {
                // Show toast
                toast.success(`Thread created successfully!`);
                navigate(`/topics/${variables.topic}`);
            } else {
                toast(`Something unexpected happened: ${data.data.message}`);
            }
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            ...values,
            tags: selectedTags.map((tag) => tag.value as unknown as number),
        } as ThreadRequest;
        mutation.mutate(data);
    }

    const [topics, setTopics] = useState<ListItem[]>([]);
    const [tags, setTags] = useState<ListItem[]>([]);

    const topicData = useGetList('topicList', '/topics');
    const tagData = useGetList('tagList', '/tags');

    // useMemo to prevent infinite rendering loop. React will only rerender
    // if the data fetched from the hook is different from the current state
    useMemo(() => {
        topicData
            ? setTopics(
                  (topicData as TopicResponse).data.map((topic) => ({
                      label: topic.title,
                      value: topic.slug,
                  })),
              )
            : setTopics([]);
    }, [topicData]);

    useMemo(() => {
        tagData
            ? setTags(
                  (tagData as TagResponse).data.map((tag) => ({
                      label: tag.tagName,
                      // force cast tag.id to string
                      value: tag.id as unknown as string,
                  })),
              )
            : setTags([]);
    }, [tagData]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="mb-2 flex flex-col">
                                <FormLabel className="text-lg">Topic</FormLabel>
                                <span className="text-sm text-muted-foreground">
                                    The topic that you want to post under
                                </span>
                            </div>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                'min-w-[150px] max-w-[300px] justify-between border-gray-300',
                                                !field.value && 'text-muted-foreground',
                                            )}
                                        >
                                            {field.value
                                                ? topics.find(
                                                      (topic) => topic.value === field.value,
                                                  )?.label
                                                : 'Select topic'}
                                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="min-w-[150px] max-w-[300px]  p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search topics..."
                                            className="h-9"
                                        />
                                        <CommandEmpty className="p-0">
                                            <Button
                                                variant="ghost"
                                                className="text-muted-foreground"
                                                onClick={() => navigate('/topics/new')}
                                            >
                                                <PlusIcon
                                                    size={16}
                                                    className="mr-2"
                                                    color="#6b7280"
                                                />
                                                Create a new topic
                                            </Button>
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {topics.map((topic) => (
                                                <CommandItem
                                                    value={topic.label}
                                                    key={topic.value}
                                                    onSelect={() => {
                                                        form.setValue('topic', topic.value);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {topic.label}
                                                    <CheckIcon
                                                        className={cn(
                                                            'ml-auto h-4 w-4',
                                                            topic.value === field.value
                                                                ? 'opacity-100'
                                                                : 'opacity-0',
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
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
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                        />
                        <NewTagDialog />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="description"
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
                    Create Thread
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
