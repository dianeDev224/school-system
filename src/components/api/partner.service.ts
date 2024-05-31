import supabase from "@/data-source.ts";
import {country, partner, partner_fees} from "@/types/database-types.ts";

class PartnerMapper{
    static mapToPartner(data:partner):partner{
        return {
            partner_name : data.partner_name ,
            shortname : data.shortname
        }
    }
}

export class PartnerService{
    static async newPartner(data:partner , onSuccess?:Function , onError?:Function){
        const requestData = await supabase.from('partner')
            .insert([PartnerMapper.mapToPartner(data)])
            .select()
        if(requestData.error){
            console.error(requestData.error)
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async getPartner(onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('partner')
            .select(`*`)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data as partner[]
        }
    }



}