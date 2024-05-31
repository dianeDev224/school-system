import supabase from "@/data-source.ts";
import {PostgrestSingleResponse, User} from "@supabase/supabase-js";
import {agency, subscription, user_profile} from "@/types/database-types.ts";
import {AgencyService} from "@/components/api/agency.service.ts";
import {UserService} from "@/components/user.service.ts";
import {UserProfileService} from "@/components/api/userProfile.service.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {Logger} from "@/components/utils/Logger.ts";


export class SubscriptionMapper{
    static mapSubscription(data:subscription):subscription{
        return {
            agency_name : data.agency_name,
            agency_shortname : "AL"+data.agency_country?.shortname+data.agency_name?.slice(-3)+Math.round(Math.random())*100 ,
            agency_phone : (data.agency_country?.code || '') + data.agency_phone,
            agency_owner_first_name : data.agency_owner_first_name,
            agency_owner_last_name : data.agency_owner_last_name,
            agency_owner_email : data.agency_owner_email ,
            agency_owner_password : data.agency_owner_password ,
            agency_owner_phone_number : (data.agency_country?.code || '') + data.agency_owner_phone_number ,
            agency_type : data.agency_type ,
            agency_level : data.agency_level ,
            agency_country_id : data.agency_country?.id ,
            agency_town_id : data.agency_town?.id ,
            agency_neighborhood_id : data.agency_neighborhood?.id ,
        }
    }
    static mapToAgency(data:subscription):agency{
        return {
            agency_name:data.agency_name ,
            agency_shortname:data.agency_shortname ,
            agency_phone:data.agency_phone ,
            agency_type:data.agency_type ,
            agency_level:data.agency_level,
            agency_country:data.agency_country ,
            agency_town:data.agency_town ,
            agency_neighborhood:data.agency_neighborhood
        }
    }

    static mapToUserProfile(data:subscription):user_profile{
        return {
            firstname : data.agency_owner_first_name ,
            lastname : data.agency_owner_last_name ,
            phone_number : data.agency_owner_phone_number  ,
            photo : data.agency_owner_photo
        }

    }

    static mapToUSer(data:subscription):{email:string , password:string}{
        return {
            email : data.agency_owner_email || '',
            password :data.agency_owner_password || ''
        }
    }
}

class Utils{

    static async onUserCreationSuccess(data:subscription , userData:User){
        await  AgencyService.newAgency(SubscriptionMapper.mapToAgency(data) , (agencyData:agency)=>this.onAgencyCreationSuccess(data , agencyData , userData) ,(error:any)=>this.onAgencyCreationError(error , userData))
    }

    static async onAgencyCreationSuccess(data:subscription , agencyData:agency , userData:User){
       await UserProfileService.newUserProfile({...SubscriptionMapper.mapToUserProfile(data) , agency:agencyData , user:userData} , (userProfileData:user_profile)=>Utils.onUserProfileCreationSuccess(data, userProfileData , agencyData) , (error:any)=>Utils.onUserProfileCreationError(error ,agencyData , userData))
    }

    static  async onUserProfileCreationSuccess(data:subscription , userProfileData:user_profile , agencyData:agency){
        Logger.info(""+data)
        await AgencyService.updateAgency({...agencyData , agency_owner : userProfileData} , async()=>console.log("sucessfully updated") , ()=>console.log("error occured when updating"))
        await SubscriptionService.deleteSubscription(data)
    }

    static async onUserCreationError(error:any){
        const message = GlobalErrorHandler.process_error(error)
        ElMessage({
            message : message ,
            showClose : true ,
            type : "error"
        })
    }

    static async onAgencyCreationError(error:any , userData:User){
        await UserService.deleteUser(userData)
        const message = GlobalErrorHandler.process_error(error)
        ElMessage({
            message : message ,
            showClose : true ,
            type : "error"
        })
    }

    static async onUserProfileCreationError(erorr:any , agencyData:agency , userData:User){
        await UserService.deleteUser(userData)
        await AgencyService.deleteAgency(agencyData)
        const message = GlobalErrorHandler.process_error(erorr)
        ElMessage({
            message : message ,
            showClose : true ,
            type : "error"
        })
    }

}

export class SubscriptionService{
    static async newSubscription(data:subscription , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData:PostgrestSingleResponse<any[]> =  await supabase.from('subscription')
            .insert([SubscriptionMapper.mapSubscription(data)])
            .select();
        if (requestData.error) {
            console.log("erreru sur venue  : " ,  requestData.error)
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async updateSubscription(data:subscription , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData:PostgrestSingleResponse<any[]> =  await supabase.from('subscription')
            .update(SubscriptionMapper.mapSubscription(data))
            .eq("id", data.id)
            .select();
        if (requestData.error) {
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }
    static async deleteSubscription(data:subscription , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData:PostgrestSingleResponse<any[]> =  await supabase.from('subscription')
            .delete()
            .eq("id", data.id)
            .select();
        if (requestData.error) {
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async getSubscription(onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('subscription')
            .select(`* ,
            agency_country:country(*),
            agency_town:town(*),
            agency_neighborhood:neighborhood(*)
      `)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data as subscription[]
        }
    }

    static async validateSubscription(data:subscription ){
        const requestData = await supabase.rpc("validate_subscription" , {
            input:{
                ...SubscriptionMapper.mapSubscription(data) ,
                id:data.id ,
                agency_phone : data.agency_phone?.slice(-13),
                agency_owner_phone_number : data.agency_owner_phone_number?.slice(-13)
            }});
    }
}
