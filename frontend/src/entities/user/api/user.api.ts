import {User} from "../types/user.ts"
import {baseApi} from "@app/api/base.ts";

export const UserApi = {
    getUsers: async() =>{
        try{
            const response = baseApi.get()
            return response.data
        }
        catch(e){
            console.log(e)
        }
    }
}