import {country, fees} from "@/types/database-types.ts";
import supabase from "@/data-source.ts";

class Alsaba_feesMapper{
    static mapToAlsaba_fees(data:fees):fees{
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

export class Alsaba_feesService{
    static async getAlsaba_fees(onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('alsaba_fees')
            .select(`*`)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data as alsaba_fees[]
        }
    }

    static async getAlsaba_fees_by_country_interval(baseCountry:country, targetCountry:country , amount:number  ,onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('fees')
            .select(`*`)
            .eq('base_country_id' , baseCountry.id)
            .eq('target_country_id' , targetCountry.id)
            .lte('lower_bound' , amount)
            .gte('upper_bound' , amount)

        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data[0] as alsaba_fees
        }
    }
    static async newAlsaba_fees(data:alsaba_fees , onSuccess?:Function , onError?:Function){
        const requestData = await supabase.from('alsaba_fees')
            .insert([Alsaba_feesMapper.mapToAlsaba_fees(data)])
            .select()
        if(requestData.error){
            console.error(requestData.error)
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }
}