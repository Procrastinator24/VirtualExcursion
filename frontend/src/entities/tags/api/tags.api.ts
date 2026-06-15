import {Tag} from "../types/tag.ts"
import {baseApi} from "@app/api/base.ts"
export const TagsApi= {
    getTags: async() :Promise<Tag[]> => {
        try{
            const response = baseApi.get()
            return response.data
        }
        catch(e){
            console.log(e)
        }

    }
}