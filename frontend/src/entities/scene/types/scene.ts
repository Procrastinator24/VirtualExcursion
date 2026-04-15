export interface ModelScene{
    id: number;
    sceneId: number,
    sceneName: string,
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