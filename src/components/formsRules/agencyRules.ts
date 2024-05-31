import {reactive} from "vue";
import {FormRules} from "element-plus";
import {subscription} from "@/types/database-types.ts";
import {phoneNumberValidator} from "@/components/formsRules/commonValidators.ts";

export const AgencyRules = (form:any)=>{
    return reactive<FormRules<subscription>>({
        agency_name: [{ required: true, message: 'le nom de l\'agence est obligatoire', trigger: 'blur' }],
        agency_shortname: [{required: true,message: 'la nom abrégé est obligatoire',trigger: 'blur'}],
        agency_phone: [
            {required: true,message: 'le numero de telephone de l\'agence est obligatoire',trigger: 'blur'} ,
            {validator : (rule: any, value: string, callback: any)=>phoneNumberValidator(rule , value , callback ,form ,"agency_phone") , trigger:'change'}
        ],
        agency_level: [{required: true,message: 'le niveau de l\'agence est obligatoire',trigger: 'blur'}],
        agency_owner_first_name: [{required: true,message: 'le prénom  est obigaoire ',trigger: 'blur'}],
        agency_owner_last_name: [{required: true,message: 'le nom est obligatoire',trigger: 'blur'}],
        agency_owner_phone_number: [
            {required: true,message: 'la telephone du propriétaire  est obligatoire',trigger: 'blur'} ,
            {validator : (rule: any, value: string, callback: any)=>phoneNumberValidator(rule , value , callback ,form , "agency_owner_phone_number") , trigger:'change'}
        ],
        agency_owner_email: [{required: true,message: 'l\'email est obligatoire',   trigger: 'blur',}],
        agency_owner_password: [{required: true,message: 'le mot de passe  du proprétaire est obligatoire',trigger: 'blur',}],
        agency_country: [{required: true,message: 'le pays de l\'agence est obligatoire',trigger: 'blur'}],
        agency_town: [{required: true,message: 'la ville de l\'agence est obligatoire',trigger: 'blur'}],
        agency_neighborhood: [{required: true,message: 'le pays  de l\'agence est obligatoire',trigger: 'blur'}]
    })
}