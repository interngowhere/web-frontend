import { LoginContext, UpdateThreadContext } from '@/context';
import { ThreadUpdateInfo } from '@/types/Threads';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const ReactQueryDevtoolsProduction = React.lazy(() =>
    import('@tanstack/react-query-devtools').then((d) => ({
        default: d.ReactQueryDevtools,
    })),
);

const queryClient = new QueryClient();

function Providers(props: { children: React.ReactNode }) {
    return <ContextProviders>{props.children}</ContextProviders>;
}

function DevProviders(props: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
            <ReactQueryDevtoolsProduction initialIsOpen={false} />
        </QueryClientProvider>
    );
}

function ContextProviders(props: { children: React.ReactNode }) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [threadInfoToUpdate, setThreadInfoToUpdate] = React.useState({} as ThreadUpdateInfo);

    return (
        <LoginContext.Provider value={{ loggedIn, setLoggedIn }}>
            <UpdateThreadContext.Provider value={{ threadInfoToUpdate, setThreadInfoToUpdate }}>
                {props.children}
            </UpdateThreadContext.Provider>
        </LoginContext.Provider>
    );
}

export { Providers, DevProviders };
