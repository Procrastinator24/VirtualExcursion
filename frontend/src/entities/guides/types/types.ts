export interface GuideProfileResponse {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    avatarUrl?: string;

    // GuideProfile поля
    organizationName: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    contactEmail?: string;
    phone?: string;
    address?: string;
    isOrganization: boolean;
    createdAt: string;

    // Дополнительные поля
    excursionsCount: number;
    rating?: number;
}

// Для списка авторов/музеев
export interface AuthorCard {
    id: number;
    name: string;           // имя гида или название организации
    role: string;           // "Guide" | "Museum"
    avatarUrl?: string;     // logoUrl для музеев
    bio?: string;           // description
    excursionsCount: number;
    rating?: number;
    location?: string;      // для музеев — address или отдельное поле
}