import axios from 'axios';

const mainUrl = import.meta.env.VITE_PUBLIC_MAIN_URL;
const apiURL = import.meta.env.VITE_PUBLIC_API_URL; 

let headers = {
    'Content-Type': 'application/json',
};

const api = axios.create({
    baseURL: mainUrl,
    headers,
});

if (typeof window !== 'undefined') {
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
}

const apiMeraki = axios.create({
    baseURL: apiURL,
    headers,
});

apiMeraki.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { api, apiMeraki };
