import {Tag} from "../types/tag.ts"
import {baseApi} from "@app/api/base.ts"
export const tagApi = {
    getAll: async (): Promise<Tag[]> => {
        const response = await baseApi.get<Tag[]>('/tags');
        return response.data;
    },

    create: (data: { name: string }): Promise<Tag> => {
        return baseApi.post('/tags', data);
    },

    delete: (id: number): Promise<void> => {
        return baseApi.delete(`/tags/${id}`);
    },
};