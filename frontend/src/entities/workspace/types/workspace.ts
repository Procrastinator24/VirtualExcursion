export type VerificationStatus = 'NotSubmitted' | 'Pending' | 'Approved' | 'Rejected';

export interface WorkspaceResponse {
    showInAuthorsCatalog: boolean;
    id: number;
    name: string;
    descriptionShort?: string;
    descriptionLong?: string;
    logoUrl?: string;
    bannerUrl?: string;
    type?: string;
    website?: string;
    contactEmail?: string;
    phone?: string;
    address?: string;

    // Юридическая информация (для верификации)
    legalName?: string;
    inn?: string;
    ogrn?: string;

    // Настройки видимости
    showContactInfo: boolean;
    showExhibits: boolean;
    showExcursions: boolean;
    showMe: boolean;
    showSite: boolean;

    // Владелец
    ownerId: number;
    ownerName: string;
    workspaceId: number;
    workspaceName: string;

    // Верификация
    verificationStatus: VerificationStatus;
    verifiedAt?: string;
    rejectionReason?: string;

    // Метаданные
    createdAt: string;
    updatedAt?: string;

    // Статистика
    membersCount: number;
    excursionsCount: number;
    scenesCount: number;
    isPublished: boolean;
}

export interface CreateWorkspaceRequest {
    name: string;
    descriptionShort?: string;
    descriptionLong?: string;
    logoUrl?: string;
    bannerUrl?: string;
    website?: string;
    contactEmail?: string;
    phone?: string;
    address?: string;
    showContactInfo?: boolean;
    showExhibits?: boolean;
    showExcursions?: boolean;
    showMe?: boolean;
    showSite?: boolean;
}

export interface UpdateWorkspaceRequest {
    id: number;
    name: string;
    descriptionShort?: string;
    descriptionLong?: string;
    logoUrl?: string;
    bannerUrl?: string;
    website?: string;
    contactEmail?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    showContactInfo?: boolean;
    showExhibits?: boolean;
    showExcursions?: boolean;
    showMe?: boolean;
    showSite?: boolean;
}