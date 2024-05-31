import {town} from "@/types/database-types.ts";
import {UpdateTownForm} from "@/components/detailsForms/town-detail-form.vue";
import {NewTownForm} from "@/components/newForms/new-town-form.vue";

export class TownRequestMapper{
    static newFormToRequest(newTownForm:NewTownForm):town{
        return {
            town_name:newTownForm.name,
            country_id : newTownForm.country_id
        }
    }
    static  updateFormToRequest(updateTownForm:UpdateTownForm):town{
        return {
            town_name:updateTownForm.town_name ,
            country_id:updateTownForm.country_id
        }
    }
}