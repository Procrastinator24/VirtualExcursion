import {baseApi} from "@app/api/base"
import type {LoginResponse} from "@entities/user";
export const authApi = {
    sendCode: async(email) => {
        await baseApi.post("/Auth/send-code", {
            email
        })
    },
    login: async(data): Promise<LoginResponse> => {
        const response = await baseApi.post("/Auth/login", data)
        return response.data
    },
    register: async(data) => {
        const response = await baseApi.post("/Auth/register", data)
        return response.data
    }

}