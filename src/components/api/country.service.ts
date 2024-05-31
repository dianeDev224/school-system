import supabase from "@/data-source.ts";
import {country} from "@/types/database-types.ts";

class CountryMapper{
    static mapCountry(data:country):country{
        return {
            country_name:data.country_name,
            code:data.code,
            capital:data.capital,
            shortname:data.shortname,
            currency:data.currency,
        }
    }

}

export class CountryService{
    static async getCountries(onSuccess?:Function, onError?:Function):Promise<country[] | void>{
        const requestData = await supabase
            .from('country')
            .select(`* , town(* , neighborhood(*))`)
        if (requestData.error) {
            console.error(requestData.error)
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess()
            return requestData.data as country[]
        }
    }

    static async newCountry(data:country , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.from('country')
            .insert([CountryMapper.mapCountry(data)])
            .select();
        if (requestData.error) {
            console.error(requestData.error)
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async updateCountry(data:country , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.from('country')
            .update(data)
            .eq("id", data.id)
            .select();
        if (requestData.error) {
            onError && onError(requestData.error)
        }
        else {
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async deleteCountry(data:country , onSuccess?:Function, onError?:Function):Promise<void>{
        const requestData = await supabase.from('country')
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