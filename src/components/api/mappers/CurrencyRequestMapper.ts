import {currency} from "@/types/database-types.ts";
import {NewCurrencyForm} from "@/components/newForms/new-currency-form.vue";
import {UpdateCurrencyForm} from "@/components/detailsForms/currency-detail-form.vue";

export class CurrencyRequestMapper{
    static newFormToRequest(newCurrencyForm : NewCurrencyForm): currency {
        return {
            currency: newCurrencyForm.currency,
            base_country_id: newCurrencyForm.base_country_id,
            target_country_id: newCurrencyForm.target_country_id,
        }
    }

    static updateFormToRequest(updateCurrencyForm : UpdateCurrencyForm): currency {
        return {
            currency: updateCurrencyForm.currency,
            base_country_id: updateCurrencyForm.base_country_id,
            target_country_id: updateCurrencyForm.target_country_id,
        }
    }
}