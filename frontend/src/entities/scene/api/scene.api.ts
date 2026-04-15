import { ModelScene } from "../types/scene";
import {baseApi} from "@app/api/base.ts"

export const sceneApi = {
    getScenes: async (): Promise<ModelScene[]> =>{
        try {
            const response = await baseApi.get("/ModelScene")
            console.log(response)
            return response.data

        }
        catch (error){
            console.log(error)
        }
    },
    getSceneById: async (id: number):Promise<ModelScene> =>{
        try {
            const response = await baseApi.get<ModelScene>(`/ModelScene/${id}`)
            console.log("by id",response)
            return response.data
        }
        catch (error){
            console.log(error)
        }
    }
}