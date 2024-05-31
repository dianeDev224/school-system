import supabase from "@/data-source.ts";
import {User} from "@supabase/supabase-js";
import {subscription} from "@/types/database-types.ts";


export class UserService{
    static async getUsers(onSuccess?:Function , onError?:Function){
        const requestData = await supabase.auth.admin.listUsers()
        if (requestData.error) {
            console.error(requestData.error)
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess()
            return requestData.data
        }
    }

    static async updateUser(data:{id : string , email:string , password:string} , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.auth.admin.updateUserById(data.id, {
            email : data.email ,
            password:data.password
        })
        if (requestData.error) {
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async deleteUser(data:User , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.auth.admin.deleteUser(data.id)
        if (requestData.error) {
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async newUser(data:subscription , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.auth.signUp({
            email: data.agency_owner_email || '',
            password: data.agency_owner_password || '',
        })
        if (requestData.error) {
            console.error("new user error : " , requestData.error)
            onError && onError(requestData.error)
        }
        else {
            console.log("new user : " , requestData.data.user)
            onSuccess && onSuccess(requestData.data?.user)

        }
    }
}