// @ts-nocheck
import {FormInstance} from "element-plus";

export class FormValidator{
    static async validate(formEl:FormInstance | undefined):Promise<boolean | void>{
        if(!formEl) return
        return await formEl.validate((valid , field)=>{
            console.log(valid , field)
            return valid
        })
    }
    static shouldNotBeEqual(firstLabelValue:number){
        return (rule : any , value : number , callback : Function)=>{
            if(firstLabelValue === value){
                callback(new Error("les deux pays ne doivent pas être les mêmes"))
            }else{
                callback()
            }
        }
    }
}

export const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}