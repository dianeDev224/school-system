import {fees} from "@/types/database-types.ts";
import {NewFeesForm} from "@/components/newForms/new-fees-form.vue";
import {UpdateFeesForm} from "@/components/detailsForms/fees-detail-form.vue";

export class FeeRequestMappper {
    static newFormToRequest(form:NewFeesForm):fees {
        return {
            base_country_id : form.base_country_id,
            target_country_id : form.target_country_id,
            lower_bound : form.lower_bound,
            upper_bound : form.upper_bound,
            fees : form.fees,
            fees_type : form.fees_type
        }
    }

    static updateFormToRequest(form:UpdateFeesForm):fees {
        return {
            base_country_id : form.base_country_id,
            target_country_id : form.target_country_id,
            lower_bound : form.lower_bound,
            upper_bound : form.upper_bound,
            fees : form.fees,
            fees_type : form.fees_type
        }
    }
}