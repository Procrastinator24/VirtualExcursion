import { baseApi } from '@app/api/base.ts';
import type { GuideProfileResponse, AuthorCard } from '../types/types.ts';

export const guideApi = {
    // Получить всех гидов
    getAllGuides: () =>
        baseApi.get<GuideProfileResponse[]>('/GuideProfile'),

    // Получить только обычных гидов (физические лица)
    getIndividualGuides: () =>
        baseApi.get<GuideProfileResponse[]>('/GuideProfile/individuals'),

    // Получить только организации/музеи
    getOrganizations: () =>
        baseApi.get<GuideProfileResponse[]>('/GuideProfile/organizations'),

    // Получить по ID
    getById: (id: number) =>
        baseApi.get<GuideProfileResponse>(`/GuideProfile/${id}`),

    // Получить по userId
    getByUserId: (userId: number) =>
        baseApi.get<GuideProfileResponse>(`/GuideProfile/user/${userId}`),
};

// Преобразование для карточек авторов
