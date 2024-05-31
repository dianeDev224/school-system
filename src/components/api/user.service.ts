//@ts-nocheck

import supabase from "@/data-source.ts";
import {AuthTokenResponsePassword} from "@supabase/supabase-js";
import {router} from "@/routes";

export class UserService{
    static async login(phone_number:string , password:string , onSuccess?:Function , onError?:Function){
        let user_email= await supabase.rpc('user_email' , {phone_number : phone_number})
        console.log("user email : " , user_email.data)
        const auth = await supabase.auth.signInWithPassword({email: user_email.data?.[0].email,password: password})
        await UserService.authGuard(auth , onSuccess , onError)
    }

    static async authGuard(auth:AuthTokenResponsePassword , onSuccess?:Function , onError?:Function){
        if(auth.data.session){
            onSuccess && onSuccess()
            await router.push({path : "/"})
        }else{
            onError && onError("telephone ou mot de passe invalid")
        }
    }
}