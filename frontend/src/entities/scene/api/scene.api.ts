import {ModelScene, Scene} from "../types/scene";
import {baseApi} from "@app/api/base.ts"
import {ExcursionResponse} from "../../excursion";

export const sceneApi = {
    getByWorkspaceId: (workspaceId: number) => {
        const response = baseApi.get<ExcursionResponse>(`/scene/workspace/${workspaceId}`)
        return response
    },
    getModelScenes: async (): Promise<ModelScene[]> =>{
        try {
            const response = await baseApi.get("/ModelScene")
            console.log(response)
            return response.data

        }
        catch (error){
            console.log(error)
        }
    },
    getScenes: async() : Promise<Scene[]> => {
        try {
            const response = await baseApi.get("/Scene")
            console.log(response)
            return response.data

        }
        catch (error){
            console.log(error)
        }
    },
    getModelSceneById: async (id: number):Promise<ModelScene> =>{
        try {
            const response = await baseApi.get<ModelScene>(`/ModelScene/${id}`)
            //console.log("by id",response)
            return response.data
        }
        catch (error){
            console.log(error)
        }
    },
    getSceneById: async (id: number):Promise<Scene> =>{
        try {
            const response = await baseApi.get<Scene>(`/Scene/${id}`)
            //console.log("by id",response)
            return response.data
        }
        catch (error){
            console.log(error)
        }
    },
    getByGuideId: (guideProfileId: number) =>
        baseApi.get<Scene[]>(`/Scene/guide/${guideProfileId}`),
}