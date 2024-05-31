import {agency, caveaux} from "@/types/database-types.ts";
import supabase from "@/data-source.ts";


class CaveauxMapper{
    static mapToCaveaux(data:caveaux):caveaux{
        return {
            name : data.name
        }
    }
}


export class CaveauxService{
    static async getCaveaux(onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('caveaux')
            .select(`*`)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            onSuccess && onSuccess()
            return requestdata.data as caveaux[]
        }
    }

    static async newCaveaux(data:caveaux , onSuccess?:Function , onError?:Function){
        const requestData = await supabase.from('caveaux')
            .insert([CaveauxMapper.mapToCaveaux(data)])
            .select()
        if(requestData.error){
            console.error(requestData.error)
            onError && onError(requestData.error)
        }else{
            onSuccess && onSuccess(requestData.data)
        }
    }

    static async getCurrentUSerCaveaux(current_agency : agency , onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('caveaux')
            .select(`*`)
            .eq('agency_id' , current_agency.id)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            console.log("agency data : " , requestdata.data)
            onSuccess && onSuccess()
            return requestdata.data as caveaux[]
        }
    }
}