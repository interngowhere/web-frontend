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
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

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
        path: '/topics/:id',
        element: <TopicDetailPage />,
    },
    {
        path: '/topics/new',
        element: <NewTopicPage />,
    },
    {
        path: '/threads',
        element: <ThreadsPage />,
    },
    {
        path: '/threads/:title',
        element: <ThreadDetailPage />,
    },
    {
        path: '/threads/new',
        element: <NewThreadPage />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
