// baseApi.ts
import axios from 'axios';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

// 🔥 Список публичных эндпоинтов, которые не требуют авторизации
const PUBLIC_URLS = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/send-code',
    '/auth/verify-code',
    '/scenes',        // Список сцен
    '/scenes/',       // Конкретная сцена
    '/excursions',    // Список экскурсий
    '/excursions/',   // Конкретная экскурсия
    '/workspaces',    // Публичные пространства (если есть)
    '/authors'
];

const isPublicUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    return PUBLIC_URLS.some(publicUrl => url.startsWith(publicUrl));
};

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

// Добавляем токен к запросам (только если он есть)
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

        // Если запрос публичный — просто возвращаем ошибку, не редиректим
        if (isPublicUrl(originalRequest.url)) {
            return Promise.reject(error);
        }

        // Если не 401 или уже пробовали обновить
        if (error.response?.status !== 401 || originalRequest._retry) {
            // Для приватных запросов с 401 — редирект
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/auth';
            }
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Обновление токена (если есть refresh token)
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const response = await axios.post('/api/auth/refresh', { refreshToken });
                const { token, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Повторяем оригинальный запрос с новым токеном
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return baseApi(originalRequest);
            } catch (refreshError) {
                // Если рефреш не удался — редирект на логин
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        // Если рефреш-токена нет — редирект на логин
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';

        return Promise.reject(error);
    }
);