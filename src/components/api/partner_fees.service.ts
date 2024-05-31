import supabase from "@/data-source.ts";
import {country, partner_fees} from "@/types/database-types.ts";

class  Partner_feesMapper{
    static mapToPartner_fees(data:partner_fees):partner_fees{
        return {
            fees_type : data.fees_type ,
            base_country_id : data.base_country?.id,
            target_country_id : data.target_country?.id,
            lower_bound : data.lower_bound,
            upper_bound : data.upper_bound,
            fees : data.fees
        }
    }

}

export class Partner_feesService {
    static async getPartner_fees(onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('partner_fees')
            .select(`*`)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data as partner_fees[]
        }
    }

    static async getPartener_fees_by_country_interval(baseCountry:country, targetCountry:country , amount:number , partner:partner  ,onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('partner_fees')
            .select(`*`)
            .eq('base_country_id' , baseCountry.id)
            .eq('target_country_id' , targetCountry.id)
            .lte('lower_bound' , amount)
            .gte('upper_bound' , amount)
            .eq("partner_id" , partner.id)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data[0] as partner_fees
        }
    }
    static async newPartner_fees(data:partner_fees , onSuccess?:Function , onError?:Function){
        const requestData = await supabase.from('partner_fees')
            .insert([Partner_feesMapper.mapToPartner_fees(data)])
            .select()
        if(requestData.error){
            console.error(requestData.error)
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }
}