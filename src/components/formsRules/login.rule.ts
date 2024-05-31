import {reactive} from "vue";
import {FormRules} from "element-plus";
import {phoneNumberValidator} from "@/components/formsRules/commonValidators.ts";
import {LoginType} from "@/types/app.type.ts";

export const AgencyRules = (form:any)=>{
    return reactive<FormRules<LoginType>>({
        password : [
            {required: true, message: 'le mot de pass est obligatoire', trigger: 'change'} ,
        ] ,
        phoneNumber: [
            {required: true, message: 'le telephone est obligatoire' , trigger: 'change'},
            {validator: (rule: any, value: string, callback: any)=>phoneNumberValidator(rule , value , callback ,form , "agency_owner_phone_number"), trigger: 'change'}
        ]
    })
}

