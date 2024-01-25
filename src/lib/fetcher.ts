import axios from 'axios';

const axiosConfig = {
    baseURL: import.meta.env.VITE_BASE_URL,
};

const fetcher = axios.create(axiosConfig);

export default fetcher;
