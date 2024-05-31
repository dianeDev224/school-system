import {reactive} from "vue";
import {FormRules} from "element-plus";
import {transfert} from "@/types/database-types.ts";
import {phoneNumberValidator} from "@/components/formsRules/commonValidators.ts";

export const TransfertRules = (form:any)=>{
    return reactive<FormRules<transfert>>({
        transfert_expeditaire_firstname: [{ required: true, message: 'le prenom de l\'expediteur est obligatoire', trigger: 'blur' }],
        transfert_expeditaire_lastname: [{required: true,message: 'la nom de l\'expediteur est obligatoire',trigger: 'blur'}],
        transfert_expeditaire_phoneNumber: [
            {required: true,message: 'le numero de telephone de l\'expediteur est obligatoire',trigger: 'blur'} ,
            {validator : (rule: any, value: string, callback: any)=>phoneNumberValidator(rule , value , callback ,form ,"transfert_expeditaire_phoneNumber") , trigger:'change'}
        ],
        transfert_destinataire_firstname: [{ required: true, message: 'le prenom du destinataire est obligatoire', trigger: 'blur' }],
        transfert_destinataire_lastname: [{required: true,message: 'la nom du destiataire est obligatoire',trigger: 'blur'}],
        transfert_destinataire_phoneNumber: [
            {required: true,message: 'le numero de telephone du destinataire est obligatoire',trigger: 'blur'} ,
            {validator : (rule: any, value: string, callback: any)=>phoneNumberValidator(rule , value , callback ,form ,"transfert_expeditaire_phoneNumber") , trigger:'change'}
        ],
        transfert_mal: [{required: true,message: 'le montant à livré est obligatoire',trigger: 'blur'}],
        transfert_type: [{required: true,message: 'le type de transfert est obligaoire ',trigger: 'blur'}],
        transfert_livraisontype: [{required: true,message: 'le type de livraison est obligaoire ',trigger: 'blur'}],
        transfert_target_agency: [{required: true,message: 'l\'agence de destination est obligatoire',trigger: 'blur'}],
        transfert_target_country: [{required: true,message: 'le pays de destination est obligatoire',trigger: 'blur'}],
        transfert_target_town: [{required: true,message: 'la ville de destination est obligatoire',trigger: 'blur'}]
    })
}