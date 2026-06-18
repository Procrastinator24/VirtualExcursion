import { baseApi } from '@app/api/base.ts';
import {
    CreateExcursionRequest,
    UpdateExcursionRequest,
    ExcursionResponse,
    ExcursionShortResponse,
    ExcursionFilters,
    ExcursionQueryParams,
    AddSceneToExcursionRequest,
    ReorderExcursionScenesRequest
} from '../types/excursion.ts';

export const excursionApi = {
    getByWorkspaceId: (workspaceId: number) => {
        const response = baseApi.get<ExcursionResponse[]>(`/excursion/workspace/${workspaceId}`)
        return response
    },
    // Получить все экскурсии
    getAll: (params?: ExcursionQueryParams) =>
        baseApi.get<ExcursionResponse[]>('/excursion', { params }),

    // Получить экскурсию по id
    getById: (id: number) =>
        baseApi.get<ExcursionResponse>(`/excursion/${id}`),

    // Получить экскурсии гида
    getByGuideId: (guideId: number) =>
        baseApi.get<ExcursionResponse[]>(`/excursion/guide/${guideId}`),

    // Создать экскурсию
    create: (data: CreateExcursionRequest) =>
        baseApi.post<ExcursionResponse>('/excursion', data),

    // Обновить экскурсию
    update: (data: UpdateExcursionRequest) =>
        baseApi.put<ExcursionResponse>('/excursion', data),

    // Удалить экскурсию
    delete: (id: number) =>
        baseApi.delete<void>(`/excursion/${id}`),

    // Добавить сцену в экскурсию
    addScene: (data: AddSceneToExcursionRequest) =>
        baseApi.post(`/excursion/${data.excursionId}/scenes/${data.sceneId}`, null, {
            params: { order: data.order ?? 0 }
        }),

    // Удалить сцену из экскурсии
    removeScene: (excursionId: number, sceneId: number) =>
        baseApi.delete(`/excursion/${excursionId}/scenes/${sceneId}`),

    // Изменить порядок сцен
    // reorderScenes: (data: ReorderExcursioncenesRequest) =>
    //     baseApi.post('/excursion/reorder', data),

    // Увеличить счётчик просмотров
    incrementViewCount: (id: number) =>
        baseApi.post(`/excursion/${id}/view`),
    uploadThumbnail: (formData: FormData) =>
        baseApi.post<{ url: string }>('/excursion/upload-thumbnail', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};