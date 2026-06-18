import { Tag } from '@entities/tags';
import { ExcursionSceneResponse } from '@entities/scene';

// ============ REQUEST ============

export interface CreateExcursionRequest {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: string;
    isPublished?: boolean;
    sceneIds: number[];
    tagIds?: number[];
}

export interface UpdateExcursionRequest {
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: string;
    isPublished?: boolean;
    tagIds?: number[];
}

export interface AddSceneToExcursionRequest {
    excursionId: number;
    sceneId: number;
    order?: number;
}

export interface RemoveSceneFromExcursionRequest {
    excursionId: number;
    sceneId: number;
}

export interface ReorderExcursionScenesRequest {
    excursionId: number;
    sceneOrders: SceneOrderDto[];
}

export interface SceneOrderDto {
    sceneId: number;
    order: number;
}

// ============ RESPONSE ============

export interface ExcursionResponse {
    region: string;
    period: string;
    workspaceId: any;
    workspaceName: string;
    id: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    duration?: string;
    viewCount: number;
    city: string;
    theme: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt?: string;
    scenes: ExcursionSceneResponse[];
    tags: Tag[];
    favouritesCount: number;
    isFavourite: boolean;
    contentTypes: string[]
    tagsNames: string[]
}

export interface ExcursionShortResponse {
    id: number;
    title: string;
    thumbnailUrl?: string;
    duration?: string;
}

// ============ FILTERS ============

export interface ExcursionFilters {
    search?: string;
    tagIds?: number[];
    guideId?: number;
    isPublished?: boolean;
    onlyFavourites?: boolean;
}

// ============ QUERY PARAMS ============

export interface ExcursionQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;        // comma-separated tag slugs или ids
    guideId?: number;
    isPublished?: boolean;
    sortBy?: 'createdAt' | 'viewCount' | 'title';
    sortOrder?: 'asc' | 'desc';
}