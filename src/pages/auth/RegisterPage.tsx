import { NavBarWrapper } from '@/components/layout/wrappers';
import { Button } from '@/components/primitives/Button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/primitives/Form';
import Input from '@/components/primitives/Input';
import fetcher from '@/lib/fetcher';
import { APIResponse } from '@/types/Api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be at least 2 characters long' })
        .max(20, { message: 'Username can be at most 20 characters long' }),
    email: z.string().email({ message: 'Please use a valid email address' }),
    password: z.string(),
});

export default function RegisterPage() {
    return (
        <NavBarWrapper>
            <div className="flex h-[calc(100vh-3.5rem)] w-full place-content-center place-items-center bg-gray-100">
                <div className="m-6 flex w-[400px] flex-col rounded-xl bg-white p-8 shadow md:m-12">
                    <h3 className="mb-6 text-2xl font-bold">Create an Account</h3>
                    <LoginForm />
                    <div className="mt-6 text-sm font-normal leading-none">
                        <span className="mr-2">Already have an account?</span>
                        <Link
                            className="cursor-pointer text-sky-600 underline underline-offset-4"
                            to="/login"
                        >
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </NavBarWrapper>
    );
}

function LoginForm() {
    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setEmailError(null)
        setUsernameError(null)

        // POST user credentials to server
        fetcher
            .post('/users', values)
            .then((response) => {
                response = response as AxiosResponse;
                if (response.status === 201) {
                    // Show toast
                    toast.success('Account created successfully!');

                    // Redirect to login page
                    navigate(`/login`);
                } else {
                    toast(`Something unexpected happened: ${response.data}`);
                }
            })
            .catch((error) => {
                error = error as AxiosError;
                if (!error.response) {
                    toast.error('Unable to connect to server. Please try again later.');
                } 

                const err = error.response.data as APIResponse;
                if (err.code === 409 && err.error?.includes("email")) {
                    setEmailError('The email has already been registered');
                } else if (err.code === 409 && err.error?.includes("username")) {
                    setUsernameError('The username has already been registered?');
                } else {
                    toast.error(`Something went wrong: ${err.message}`);
                }
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                            <span className="text-sm font-medium text-destructive">
                                {usernameError}
                            </span>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                            <span className="text-sm font-medium text-destructive">
                                {emailError}
                            </span>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Password" {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">
                    Get Started
                </Button>
            </form>
        </Form>
    );
}
