import {ModelScene, Scene} from "../types/scene";
import {baseApi} from "@app/api/base.ts"
import {ExcursionResponse} from "../../excursion";

export const sceneApi = {
    getByWorkspaceId: (workspaceId: number, onlyPublished?: boolean) => {
        const response = baseApi.get<ExcursionResponse>(`/scene/workspace/${workspaceId}`, {
            params: {onlyPublished: onlyPublished ?? true}
        })
        return response
    },
    /**
     * ��������� 3D-������ �� ������
     * @param file - ���� ������ (GLB/GLTF)
     * @returns URL ������������ �����
     */
    uploadModel: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await baseApi.post<{ url: string }>('/scene/upload-model', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    },

    /**
     * ��������� ����������� (�������, ������) �� ������
     */
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await baseApi.post<{ url: string }>('/scene/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
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



}