import {neighborhood} from "@/types/database-types.ts";
import {NewNeighborhoodForm} from "@/components/newForms/new-neighborhood-form.vue";
import {UpdateNeighborhoodForm} from "@/components/detailsForms/neighborhood-detail-form.vue";

export class NeighborhoodRequestMapper {
    static newFormToRequest(newNeighborhoodForm:NewNeighborhoodForm):neighborhood{
        return {
            neighborhood_name : newNeighborhoodForm.name,
            town_id : newNeighborhoodForm.town_id
        }
    }

    static updateFormToRequest(updateNeighborhoodForm:UpdateNeighborhoodForm):neighborhood{
        return {
            neighborhood_name : updateNeighborhoodForm.neighborhood_name,
            town_id : updateNeighborhoodForm.town_id
        }
    }
}