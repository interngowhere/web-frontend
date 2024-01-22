import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

const ReactQueryDevtoolsProduction = React.lazy(() =>
    import('@tanstack/react-query-devtools').then((d) => ({
        default: d.ReactQueryDevtools,
    })),
);

const queryClient = new QueryClient();

function Providers(props: { children: ReactNode }) {
    return <>{props.children}</>;
}

function DevProviders(props: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
            <ReactQueryDevtoolsProduction initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export { Providers, DevProviders };
