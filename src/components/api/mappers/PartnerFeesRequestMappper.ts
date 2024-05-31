// @ts-nocheck
import {fees} from "@/types/database-types.ts";
import {NewFeesForm} from "@/components/newForms/new-fees-form.vue";
import {UpdateFeesForm} from "@/components/detailsForms/fees-detail-form.vue";
import NewPartnerFeesForm from "@/components/newForms/new-partner-fees-form.vue";
import {UpdatePartnerFeesForm} from "@/components/detailsForms/partner-fees-detail-form.vue";

export class PartnerFeesRequestMappper {
    static newFormToRequest(form:NewPartnerFeesForm):fees {
        return {
            base_country_id : form.base_country_id,
            target_country_id : form.target_country_id,
            lower_bound : form.lower_bound,
            upper_bound : form.upper_bound,
            fees : form.fees,
            fees_type : form.fees_type
        }
    }

    static updateFormToRequest(form:UpdatePartnerFeesForm):fees {
        return {
            partner_id : form.partner_id,
            base_country_id : form.base_country_id,
            target_country_id : form.target_country_id,
            lower_bound : form.lower_bound,
            upper_bound : form.upper_bound,
            fees : form.fees,
            fees_type : form.fees_type
        }
    }
}