import {NewCommissionForm} from "@/components/newForms/new-commission-form.vue";
import {commission} from "@/types/database-types.ts";
import {UpdateCommissionForm} from "@/components/detailsForms/commission-detail-form.vue";

export class CommissionRequestMapper{
    static newFormToRequest(newCommissionForm : NewCommissionForm): commission {
        return {
            base_country_id: newCommissionForm.base_country_id,
            target_country_id: newCommissionForm.target_country_id,
            base_country_rate : newCommissionForm.base_country_rate ,
            target_country_rate : newCommissionForm.target_country_rate
        }
    }

    static updateFormToRequest(updateCommissionForm : UpdateCommissionForm): commission {
        return {
            base_country_id: updateCommissionForm.base_country_id,
            target_country_id: updateCommissionForm.target_country_id,
            base_country_rate : updateCommissionForm.base_country_rate ,
            target_country_rate : updateCommissionForm.target_country_rate
        }
    }
}