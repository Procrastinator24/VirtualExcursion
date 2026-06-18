import { ExcursionResponse } from "@entities/excursion";
import { PointOfInterest } from "@entities/pointOfInterest";
import { Tag } from "@entities/tags";

export interface ModelScene{
    id: number;
    sceneId: number,
    sceneName: string,
    description: string,
    author: string
    modelUrl: string,
    modelFormat: string,
    cameraStartX: number,
    cameraStartY: number,
    cameraStartZ: number,
    cameraTargetX: number,
    cameraTargetY: number,
    cameraTargetZ: number,
    ambientLightIntensity: number,
    enableVR: boolean,
    pointsOfInterestCount: number,

}
export interface Scene{
    region: string;
    period: string;
    id: number;
    title: string;
    description?: string;
    theme?: string;
    thumbnailUrl?: string;
    contentType: '3d' | 'image' | 'video' | 'panorama';
    authorId: number;
    authorName?: string;
    isPublished: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    workspaceId?: number;

    // 3D поля
    modelUrl?: string;
    modelFormat?: string;
    cameraStartX?: number;
    cameraStartY?: number;
    cameraStartZ?: number;
    cameraTargetX?: number;
    cameraTargetY?: number;
    cameraTargetZ?: number;
    ambientLightIntensity?: number;
    enableVR?: boolean;

    // Image поля
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;

    // Video поля
    videoUrl?: string;
    durationSeconds?: number;

    // Panorama поля
    panoramaUrl?: string;
    panoramaType?: string;

    // Точки интереса
    pointsOfInterest?: PointOfInterest[];
    tags?: Tag[];
    excursions?: ExcursionResponse[];
}
export interface SceneShortResponse {
    id: number;
    title: string;
    thumbnailUrl?: string;
    contentType: '3d' | 'image' | 'video' | '360' | 'vr';
}

export interface ExcursionSceneResponse {
    sceneId: number;
    sceneTitle: string;
    sceneThumbnailUrl?: string;
    sceneContentType?: string;
    order: number;
}
export type ContentType = '3d' | 'image' | 'video' | 'panorama';

export interface CreatePointOfInterestRequest {
    id?: string
    title: string;
    description: string;
    x: number;
    y: number;
    z: number;
    imageUrl?: string;
}

export interface CreateSceneRequest {
    // Общие поля
    title: string;
    description: string;
    thumbnailUrl?: string;
    contentType: ContentType;
    workspaceId: number;
    isPublished: boolean;
    period?: string;
    region?: string;
    tagIds?: number[];
    excursionIds?: number[];

    // Для 3D
    modelUrl?: string;
    modelFormat?: string;
    cameraStartX?: number;
    cameraStartY?: number;
    cameraStartZ?: number;
    cameraTargetX?: number;
    cameraTargetY?: number;
    cameraTargetZ?: number;
    ambientLightIntensity?: number;
    enableVR?: boolean;
    pointsOfInterest?: CreatePointOfInterestRequest[];

    // Для Image/Video/Panorama
    mediaUrl?: string;

    // Для Video
    durationSeconds?: number;
}