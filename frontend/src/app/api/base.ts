// baseApi.ts - интерцептор
import axios from 'axios';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

export const baseApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

// Добавляем токен к запросам
baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Обрабатываем 401
baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если не 401 или уже пробовали обновить — отдаём ошибку
        if (error.response?.status !== 401 || originalRequest._retry) {
            // Если токен истёк — очищаем и редиректим
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth';
            }
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // TODO: Здесь будет обновление токена (refresh token)
        // Пока просто редиректим на логин
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';

        return Promise.reject(error);
    }
);