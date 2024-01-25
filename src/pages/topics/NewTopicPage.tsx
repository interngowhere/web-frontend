import { NavBarWrapper } from '@/components/layout/wrappers';
import { Button } from '@/components/primitives/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/primitives/Form';
import Input from '@/components/primitives/Input';
import Textarea from '@/components/primitives/TextArea';
import fetcher from "@/lib/fetcher";
import { APIResponse } from "@/types/Api";
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse, AxiosError } from "axios";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { z } from 'zod';

const formSchema = z.object({
    title: z
        .string()
        .min(2, { message: 'Title must be at least 2 characters long' })
        .max(50, { message: 'Title can be at most 50 characters long' }),
    shortDescription: z
        .string()
        .min(20, { message: 'Short description must be at least 20 characters long' })
        .max(255, { message: 'Short description can be at most 255 characters long' }),
    description: z
        .string()
        .min(20, { message: 'Description must be at least 20 characters long' })
        .max(4096, { message: 'Maximum length of description reached' }),
});

export default function NewTopicPage() {
    return (
        <NavBarWrapper>
            <div className="flex min-h-[calc(100vh-3.5rem)] w-full place-content-center place-items-center bg-gray-200">
                <div className="m-6 flex w-full max-w-[--max-width] flex-col rounded-xl bg-white p-8 shadow md:m-12">
                    <h3 className="mb-6 text-2xl font-bold">Create a new topic</h3>
                    <NewTopicForm />
                </div>
            </div>
        </NavBarWrapper>
    );
}

function NewTopicForm() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // POST login credentials to server
        fetcher
            .post('/topics', values)
            .then((response) => {
                response = response as AxiosResponse;
                if (response.status === 201) {
                    // Show toast
                    toast.success('Topic created successfully!');

                    // Redirect to topics page
                    navigate(`/topics`);
                } else {
                    toast(`Something unexpected happened: ${response.data}`);
                }
            })
            .catch((error) => {
                error = error as AxiosError;
                if (!error.response) {
                    toast.error('Unable to connect to server. Please try again later.');
                    return;
                }
                const err = error.response.data as APIResponse;
                toast.error(`Something unexpected happened: ${err.message}`);
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex flex-col mb-2'>
                                <FormLabel className='text-lg'>Title</FormLabel>
                                <span className="text-sm text-muted-foreground">
                                    The title of your topic
                                </span>
                            </div>
                            <FormControl>
                                <Input placeholder="e.g. Cloud" {...field} className="text-sm" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex flex-col mb-2'>
                                <FormLabel className='text-lg'>Short Description</FormLabel>
                                <span className="text-sm text-muted-foreground">
                                    Provide a concise summary of your topic that will be displayed on the topic card
                                </span>
                            </div>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g. this is a place for interested"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex flex-col mb-2'>
                                <FormLabel className='text-lg'>Description</FormLabel>
                                <span className="text-sm text-muted-foreground">
                                    Give a detailed description of your topic
                                </span>
                            </div>
                            <FormControl>
                                <Textarea
                                    className='h-[calc(20vh)]'
                                    placeholder="e.g. this is a place for interested"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full max-w-48 ml-auto" type="submit" variant="primary">
                    Create Topic
                </Button>
            </form>
        </Form>
    );
}
