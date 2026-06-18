import {User} from "../types/user.ts"
import {baseApi} from "@app/api/base.ts";

export const UserApi = {
    // getUsers: async() =>{
    //     try{
    //         const response = await baseApi.get()
    //         return response.data
    //     }
    //     catch(e){
    //         console.log(e)
    //     }
    // },
    /**
     * Загрузить аватарку пользователя
     */
    uploadAvatar: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await baseApi.post<{ url: string }>('/user/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
    /**
     * Обновить информацию о пользователе
     */
    update: (data: Partial<User>) =>
        baseApi.put<User>('/user', data),
}