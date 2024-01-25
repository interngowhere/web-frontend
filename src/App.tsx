import ErrorPage from '@/pages/ErrorPage';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import NewThreadPage from '@/pages/threads/NewThreadPage';
import ThreadDetailPage from '@/pages/threads/ThreadDetailPage';
import ThreadsPage from '@/pages/threads/ThreadsPage';
import NewTopicPage from '@/pages/topics/NewTopicPage';
import TopicDetailPage from '@/pages/topics/TopicDetailPage';
import TopicsPage from '@/pages/topics/TopicsPage';
import { useContext } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

import { LoginContext } from './context';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/search',
        element: <SearchPage />,
    },
    {
        path: '/topics',
        element: <TopicsPage />,
    },
    {
        path: '/topics/:slug',
        element: <TopicDetailPage />,
    },
    {
        path: '/topics/new',
        element: (
            <ProtectedRoutes>
                <NewTopicPage />
            </ProtectedRoutes>
        ),
    },
    {
        path: '/threads',
        element: <ThreadsPage />,
    },
    {
        path: '/threads/:threadId/:slug',
        element: <ThreadDetailPage />,
    },
    {
        path: '/threads/new',
        element: (
            <ProtectedRoutes>
                <NewThreadPage />
            </ProtectedRoutes>
        ),
    },
]);

function ProtectedRoutes(props: { children: React.ReactNode }) {
    const { loggedIn } = useContext(LoginContext);
    if (!loggedIn) {
        toast.error('You need to login first');
    }
    return loggedIn ? <>{props.children}</> : <Navigate to="/login" />;
}

function App() {
    return <RouterProvider router={router} />;
}

export default App;
