import axios from 'axios';
import Cookies from 'js-cookie';

const axiosConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Authorization: 'Bearer ' + Cookies.get('token'),
    },
};

const fetcher = axios.create(axiosConfig);

export default fetcher;
