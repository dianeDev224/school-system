import supabase from "@/data-source.ts";
import {user_profile} from "@/types/database-types.ts";


class UserProfileMapper{
    static mapUserProfile(data:user_profile):user_profile{
        return {
            phone_number : data.phone_number,
            firstname : data.firstname,
            lastname : data.lastname,
            photo : data.photo,
            role_id : data.app_role?.id,
            user_id : data.user?.id,
            agency_id : data.agency?.id,
        }
    }

}

export class UserProfileService{
    static async getUserProfile(onSuccess?:Function , onError?:Function){
        const requestdata = await supabase
            .from('user_profile')
            .select(`* ,
            app_role:app_role(*),
            user:users(*),
            agency:agency(*)
      `)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data as user_profile[]
        }
    }

    static async newUserProfile(data:user_profile , onSuccess?:Function, onError?:Function):Promise<void>{
        console.log("user profile : " , data)
        const requestData = await supabase.from('user_profile')
            .insert([UserProfileMapper.mapUserProfile(data)])
            .select();
        if (requestData.error) {
            console.error("new user profile error : " , requestData.error)
            onError && onError(requestData.error)
        }
        else {
            console.log("new user profile data : " , requestData.data)
            onSuccess && onSuccess(requestData.data[0])
        }
    }

    static async updateUserProfile(data:user_profile , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.from('user_profile')
            .update(UserProfileMapper.mapUserProfile(data))
            .eq("id", data.id)
            .select();
        if (requestData.error) {
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async deleteUserProfile(data:user_profile , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.from('user_profile')
            .delete()
            .eq("id", data.id)
            .select();
        if (requestData.error) {
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess(requestData.data)
        }
    }
}