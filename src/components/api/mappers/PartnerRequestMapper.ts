import {NewPartnerForm} from "@/components/newForms/new-partner-form.vue";
import {partner} from "@/types/database-types.ts";

export class PartnerRequestMapper{
    static newFormToRequest(form : NewPartnerForm):partner{
        return {
            partner_name : form.partner_name ,
            shortname : form.shortname
        }
    }

    static updateFormToRequest(partner : partner):NewPartnerForm{
        return {
            partner_name : partner.partner_name ,
            shortname : partner.shortname
        }
    }
}