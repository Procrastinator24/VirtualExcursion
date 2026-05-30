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
    id: number
    title: string
    description: string
    theme: string
    thumbnailUrl: string
    contentType: string
    author: string
    isPublished: boolean
    viewCount: number
    createdAt: string
    updatedAt: string
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
