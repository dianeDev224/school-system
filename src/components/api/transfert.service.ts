import supabase from "@/data-source.ts";
import {fees, transfert} from "@/types/database-types.ts";
import {fees_type_list} from "@/types/database-meta-data.ts";


class TransfertMapper{
    static mapToTransfert(data:transfert):transfert{
        return {
            transfert_code:TransfertService.getTansfertCode(data),
            transfert_mal:data.transfert_mal ,
            transfert_type:data.transfert_type ,
            transfert_livraisontype:data.transfert_livraisontype,
            transfert_expeditaire_firstname:data.transfert_expeditaire_firstname ,
            transfert_expeditaire_lastname:data.transfert_expeditaire_lastname ,
            transfert_expeditaire_phone_number:data.transfert_expeditaire_phone_number ,
            transfert_destinataire_firstname:data.transfert_destinataire_firstname ,
            transfert_destinataire_lastname:data.transfert_destinataire_lastname ,
            transfert_destinataire_phone_number : data.transfert_destinataire_phone_number,
            transfert_partner_id:data.transfert_partner_id ,
            transfert_alsaba_fees_id:data.transfert_alsaba_fees?.id,
            transfert_partner_fees_id:data.transfert_partner_fees?.id,
            transfert_caveaux_id:data.transfert_caveaux_id ,
            transfert_base_agency_id:data.transfert_base_agency?.id,
            transfert_target_agency_id:data.transfert_target_agency_id ,
            transfert_target_country_id:data.transfert_target_country_id ,
            transfert_target_town_id:data?.transfert_target_town_id,

        }
    }
}

export class TransfertService {
    static async newTransfert(data:transfert , onSuccess?:Function, onError?:Function){
        const requestData = await  supabase.rpc('new_transfert' , {data : TransfertMapper.mapToTransfert(data)})
            .select()
        if(requestData.error){
            console.error(requestData.error)
            onError && onError(requestData.error)
        }else{
            console.log("data : " , requestData.data)
            onSuccess && onSuccess(requestData.data)
        }
    }
    static async getTransfert(onSuccess:Function , onError:Function){
        const requestdata = await supabase
            .from('transfert')
            .select(`* ,
            transfert_caveaux:transfert_caveaux_id(*),
            transfert_base_agency:transfert_base_agency_id(* , agency_country:agency_country_id(*)),
            transfert_target_agency:transfert_target_agency_id(*),
            transfert_target_country:transfert_target_country_id(*),
            transfert_target_town:transfert_target_town_id(*)
      `)
            .is("validated_at" , null)
        if (requestdata.error) {
            console.error(requestdata.error)
            onError && onError(requestdata.error)
        }
        else {
            console.log("transfert data : ", requestdata.data)
            onSuccess && onSuccess()
            return requestdata.data as transfert[]
        }
    }

    static getFeesFromCode(fees_field : fees , amount:number){
        if(fees_field?.fees_type == fees_type_list[0]?.code){
            return fees_field?.fees
        }else{
            return fees_field?.fees * amount ;
        }
    }

    static getTansfertCode(transfert : transfert){
        return transfert?.transfert_target_country?.shortname.toUpperCase()+'-'+'AN'+new Date(Date.now()).getFullYear().toString().slice(-2)+'-'+'M'+new Date(Date.now()).getMonth().toString()+'-'+'J'+new Date(Date.now()).getDate().toString()+'-'+Math.round(Math.random()*10000)
    }
}