import {country} from "@/types/database-types.ts";
import {UpdateCountryForm} from "@/components/detailsForms/country-detail-form.vue";
import {NewCountryForm} from "@/components/newForms/new-country-form.vue";

export class CountryRequestMapper{
    static newFormToRequest(newCountryForm:NewCountryForm):country{
        return {
            country_name:newCountryForm.name,
            capital:newCountryForm.capital,
            code:newCountryForm.code,
            currency:newCountryForm.currency ,
            shortname:newCountryForm.shortname
        }
    }

    static updateFormToRequest(updateCountryForm:UpdateCountryForm):country{
        return {
            country_name:updateCountryForm.country_name,
            capital:updateCountryForm.capital,
            code:updateCountryForm.code,
            currency:updateCountryForm.currency,
            shortname:updateCountryForm.shortname
        }
    }

}