import { baseApi } from '@app/api/base';

export const favouriteApi = {
    // Получить список избранного
    getAll: () => baseApi.get('/favourite'),

    // Добавить в избранное
    add: (data: { excursionId?: number; sceneId?: number }) =>
        baseApi.post('/favourite', data),

    // Удалить из избранного по ID
    remove: (id: number) => baseApi.delete(`/favourite/${id}`),

    // Удалить из избранного по экскурсии
    removeByExcursion: (excursionId: number) =>
        baseApi.delete(`/favourite/excursion/${excursionId}`),

    // Удалить из избранного по сцене
    removeByScene: (sceneId: number) =>
        baseApi.delete(`/favourite/scene/${sceneId}`),

    // Проверить, находится ли объект в избранном
    isFavourite: (params: { excursionId?: number; sceneId?: number }) =>
        baseApi.get<boolean>('/favourite/check', { params }),
};