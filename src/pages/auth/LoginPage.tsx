import { NavBarWrapper } from '@/components/layout/wrappers';
import { Button } from '@/components/primitives/Button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/primitives/Form';
import Input from '@/components/primitives/Input';
import { LoginContext } from '@/context';
import { login } from '@/lib/auth';
import fetcher from '@/lib/fetcher';
import { APIResponse, TokenResponse } from '@/types/Api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    email: z.string().email({ message: 'Please use a valid email address' }),
    password: z.string(),
});

export default function LoginPage() {
    return (
        <NavBarWrapper>
            <div className="flex h-[calc(100vh-3.5rem)] w-full place-content-center place-items-center bg-gray-100">
                <div className="m-6 flex w-[400px] flex-col rounded-xl bg-white p-8 shadow md:m-12">
                    <h3 className="mb-6 text-2xl font-bold">Sign In</h3>
                    <LoginForm />
                    <div className="mt-6 text-sm font-normal leading-none">
                        <span className="mr-2">Don't have an account?</span>
                        <Link
                            className="cursor-pointer text-sky-600 underline underline-offset-4"
                            to="/register"
                        >
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </NavBarWrapper>
    );
}

function LoginForm() {
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { setLoggedIn } = useContext(LoginContext);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setEmailError(null);
        setPasswordError(null);

        // POST login credentials to server
        fetcher
            .post('/login', values)
            .then((response) => {
                response = response as AxiosResponse;
                const res = response.data as TokenResponse;

                login(res.data, setLoggedIn);

                // Redirect to home page
                navigate(`/`);
            })
            .catch((error) => {
                error = error as AxiosError;
                if (!error.response) {
                    toast.error('Unable to connect to server. Please try again later.');
                    return;
                }
                const err = error.response.data as APIResponse;
                if (err.message === 'Invalid email') {
                    setEmailError('Invalid email. Has the email been registered?');
                } else if (err.message === 'Invalid password') {
                    setPasswordError(err.message);
                } else {
                    toast.error(err.message);
                }
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                            <span className="text-sm font-medium text-destructive">
                                {passwordError}
                            </span>
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">
                    Login
                </Button>
            </form>
        </Form>
    );
}