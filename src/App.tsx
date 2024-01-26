import CustomLoader from '@/components/primitives/CustomLoader';
import { LoginContext } from '@/context';
import fetcher from '@/lib/fetcher';
import ErrorPage from '@/pages/ErrorPage';
import SearchPage from '@/pages/SearchPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import NewThreadPage from '@/pages/threads/NewThreadPage';
import ThreadDetailPage from '@/pages/threads/ThreadDetailPage';
import ThreadsPage from '@/pages/threads/ThreadsPage';
import UpdateThreadPage from '@/pages/threads/UpdateThreadPage';
import NewTopicPage from '@/pages/topics/NewTopicPage';
import TopicDetailPage from '@/pages/topics/TopicDetailPage';
import TopicsPage from '@/pages/topics/TopicsPage';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/threads"/>,
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
    {
        path: '/threads/update',
        element: (
            <ProtectedRoutes>
                <UpdateThreadPage />
            </ProtectedRoutes>
        ),
    },
    {
        path: '/settings/:section',
        element: (
            <ProtectedRoutes>
                <SettingsPage />
            </ProtectedRoutes>
        ),
    },
]);

function ProtectedRoutes(props: { children: React.ReactNode }) {
    const { loggedIn, setLoggedIn } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);

    fetcher.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');
    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const response = await fetcher.post('/ping');
            if (response.status === 200) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            setLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    } else if (loggedIn) {
        return <>{props.children}</>;
    } else {
        toast.error('Please log in to continue');
        return <Navigate to="/login" />;
    }
}

function App() {
    const { setLoggedIn } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);

    fetcher.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');
    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const response = await fetcher.post('/ping');
            if (response.status === 200) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        } catch (error) {
            setLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-screen place-content-center place-items-center">
                <CustomLoader loading={loading} />
            </div>
        );
    } else {
        return <RouterProvider router={router} />;
    }
}

export default App;
