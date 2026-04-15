import {baseApi} from "@app/api/base.ts"

export const POIApi = {
    getPOIs: async () => {
        try{
            const response = baseApi.get()
            return response.data
        }
        catch (e){
            console.log(e)
        }
    }
}