// @ts-nocheck
import {caveaux} from "@/types/database-types.ts";
import {NewCaveauxForm} from "@/components/newForms/new-caveaux-form.vue";
import {UpdateCaveauxForm} from "@/components/detailsForms/caveaux-detail-form.vue";

export class CaveauxRequestMapper{
    static newFormToRequest(data: NewCaveauxForm):caveaux{
        return {
            caveaux_name: data.caveaux_name,
        }
    }

    static  updateFormToRequest(data: UpdateCaveauxForm):caveaux{
        return {
            caveaux_name: data.caveaux_name,
        }
    }
}