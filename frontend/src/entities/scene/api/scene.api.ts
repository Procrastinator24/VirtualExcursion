import {CreateSceneRequest, ModelScene, Scene} from "../types/scene";
import {baseApi} from "@app/api/base.ts"
import {ExcursionResponse} from "../../excursion";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5209/api';
export const sceneApi = {
    getByWorkspaceId: (workspaceId: number, onlyPublished?: boolean) => {
        const response = baseApi.get<Scene[]>(`/scene/workspace/${workspaceId}`, {
            params: {onlyPublished: onlyPublished ?? false}
        })
        return response
    },
    /**
     * Создать сцену (экспонат)
     */
    create: (data: CreateSceneRequest) =>
        baseApi.post<Scene>('/scene', data),


    uploadModel: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/scene/upload-model`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 5 * 60 * 1000, // 5 минут
                }
            );
            return response.data.url;
        } catch (error) {
            console.error('Model upload failed:', error);
            throw error;
        }
    },

    uploadVideo: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('📹 Загрузка видео...', {
                fileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                url: `${API_BASE_URL}/api/scene/upload-video`
            });

            const response = await axios.post(
                `${API_BASE_URL}/api/scene/upload-video`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 10 * 60 * 1000, // 10 минут для видео
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            console.log(`📹 Загрузка видео: ${percentCompleted}%`);
                        }
                    },
                }
            );

            console.log('✅ Видео загружено:', response.data.url);
            return response.data.url;
        } catch (error) {
            console.error('Video upload failed:', error);
            throw error;
        }
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/scene/upload-image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 2 * 60 * 1000,
                }
            );
            return response.data.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    },

    // /**
    //  * ��������� 3D-������ �� ������
    //  * @param file - ���� ������ (GLB/GLTF)
    //  * @returns URL ������������ �����
    //  */
    // uploadModel: async (file: File): Promise<string> => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //
    //     const response = await baseApi.post<{ url: string }>('/scene/upload-model', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    //
    //     return response.data.url;
    // },
    //
    // /**
    //  * ��������� ����������� (�������, ������) �� ������
    //  */
    // uploadImage: async (file: File): Promise<string> => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //
    //     const response = await baseApi.post<{ url: string }>('/scene/upload-image', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    //
    //     return response.data.url;
    // },
    // uploadVideo: async (file: File): Promise<string> => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //
    //     const response = await baseApi.post<{ url: string }>('/scene/upload-video', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //     });
    //
    //     return response.data.url;
    // },

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
    getScenes: async(onlyPublished?: boolean) : Promise<Scene[]> => {
        try {
            const response = await baseApi.get("/Scene", {
                params: {onlyPublished: onlyPublished ?? true}
            })
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
    // Универсальный метод получения сцены
    getSceneById: async (id: number): Promise<Scene> => {
        const response = await baseApi.get(`/scene/${id}`);
        return response.data;
    },




}