import Cookies from 'js-cookie';
import fetcher from './fetcher';
import { toast } from 'sonner';
import { TokenResponse } from '@/types/Api';
function login(
    data: TokenResponse["data"],
    setLoggedIn: (value: React.SetStateAction<boolean>) => void
) {
    // Set token in cookies
    Cookies.set('token', data.token);
    Cookies.set('userid', data.userId);

    // Set Authorization header for future requests
    fetcher.defaults.headers.common['Authorization'] = "Bearer " + Cookies.get('token')

    // Set logged in state to true
    setLoggedIn(true)

    // Show toast
    toast.success('Logged in successfully!')
}

function logout(
    setLoggedIn: (value: React.SetStateAction<boolean>) => void
) {
    // Remove token from cookies
    Cookies.remove('token');
    Cookies.remove('userid');

    // Remove Authorization header from future requests
    fetcher.defaults.headers.common['Authorization'] = ""

    // Set logged in state to false
    setLoggedIn(false)

    // Show toast
    toast.success('Logged out successfully!')
}

export { login, logout }