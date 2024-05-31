import {agency, user_profile} from "@/types/database-types.ts";
import {PostgrestSingleResponse, User} from "@supabase/supabase-js";
import supabase from "@/data-source.ts";


class AgencyMapper{
    static mapToAgency(data:agency):agency{
        return {
            agency_name : data.agency_name ,
            agency_shortname : data.agency_shortname ,
            agency_phone : data.agency_phone ,
            agency_country_id : data.agency_country?.id ,
            agency_town_id : data.agency_town?.id ,
            agency_neighborhood_id : data.agency_neighborhood?.id ,
            agency_level : data.agency_level ,
            agency_type : data.agency_type ,
            agency_owner_id : data.agency_owner?.id
        }
    }

    static mapToUser(data:agency):User{
        return {
            id : data.agency_owner?.user_id || '' ,
            app_metadata: {},
            aud: "",
            created_at: "",
            user_metadata: {},
        }
    }
}

export class AgencyService{
    static async getAgency(onSuccess?:Function , onError?:Function){
        const requestData = await supabase.from('agency')
            .select(`
                *, agency_owner:agency_owner_id(*) , agency_country:country(*) , agency_town:town(*) ,agency_neighborhood:neighborhood(*)
            `)
        if(requestData.error){
            console.log('error ouccured when fetching agency data : ' , requestData.error)
            onError && onError()
        }else{
            console.log("agency data fetched successfully : " , requestData.data)
            onSuccess && onSuccess()
            return requestData.data as agency[]
        }
    }
    static async getCurrentAgency(onSuccess?:Function , onError?:Function){
        const currUser = await supabase.auth.getUser() ;
        const requestData = await supabase.from('user_profile')
            .select('* , agency:agency_id(* , agency_country:agency_country_id(*) , agency_town:agency_town_id(*) , agency_neighborhood:agency_neighborhood_id(*))')
            .eq('user_id' , currUser.data.user?.id)
            .limit(1)
        if(requestData.error){
            console.log('error ouccured when fetching current agency data : ' , requestData.error)
            onError && onError()
        }else{
            console.log("current agency data fetched successfully : " , requestData.data)
            onSuccess && onSuccess()
            return requestData.data[0] as user_profile
        }
    }
    static async newAgency(data:agency , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData:PostgrestSingleResponse<agency[]> =  await supabase.from('agency')
            .insert(AgencyMapper.mapToAgency(data))
            .select();
        if (requestData.error) {
            console.log("new agency error : ", requestData.error)
            onError && onError(requestData.error)
        }else{
            console.log("new agency data : ", requestData.data)
            onSuccess && onSuccess(requestData.data[0])
        }
    }

    static async deleteAgency(data:agency , onSucess?:Function , onError?:Function){
        const requestData = await supabase.auth.admin.deleteUser(data.agency_owner?.user_id) ;
        if(requestData.error){
            onError && onError()
        }else{
            onSucess && onSucess()
        }
    }

    static async updateAgency(data:agency , onSuccess?:Function , onError?:Function){
        console.log("received agency data : " , data)
        const requestData = await supabase.from('agency')
            .update(AgencyMapper.mapToAgency(data))
            .eq("id" , data.id)
            .select()
        if(requestData.error){
            console.log("agecny update error : " , requestData.error)
            onError && await onError()
        }else{
            console.log("agency updated successfully  : ", requestData.data)
            onSuccess && await onSuccess()
        }
    }
}