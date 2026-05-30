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
export const toAuthorCard = (profile: GuideProfileResponse): AuthorCard => ({
    id: profile.id,
    name: profile.isOrganization ? profile.organizationName : profile.name,
    role: profile.isOrganization ? 'Museum' : 'Guide',
    avatarUrl: profile.isOrganization ? profile.logoUrl : profile.avatarUrl,
    bio: profile.description,
    excursionsCount: profile.excursionsCount,
    rating: profile.rating,
    location: profile.address,
});