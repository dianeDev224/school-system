<!---// @ts-nocheck--->
<script setup lang="ts">


import {reactive, ref} from "vue";
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {ElLoading, FormInstance, FormRules} from "element-plus";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {PartnerRequestMapper} from "@/components/api/mappers/PartnerRequestMapper.ts";

export interface UpdatePartnerForm{
  id : number | undefined
  partner_name : string
  shortname : string
  activateEdition?:string
}



const props = defineProps<{partner:UpdatePartnerForm , activateEdition:boolean}>()

const updateCountryFormRef = ref<FormInstance>()


const updateCountryForm = reactive<UpdatePartnerForm>({
  id:props.partner.id ,
  partner_name: props.partner.partner_name ,
  shortname : props.partner.shortname ,
  activateEdition : props.partner.activateEdition
})

const rules = reactive<FormRules<UpdatePartnerForm>>({
  partner_name: [
    { required: true, message: 'le nom du partenaire est obligatoire', trigger: 'blur' },
  ],
  shortname: [
    {required: true,message: 'le nom abrégé est obigaoire ' ,trigger: 'change'},
  ]
})


const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: 'CHARGEMENT DES DONNEES',
    background: 'rgba(0, 0, 0, 0.7)',
  })
}

const openSucessMessage = (message:string="modifier avec sucesss")=>{
  ElMessage({
    message:message,
    showClose:true ,
    type:"success",
  })
}

const openErrorMessage = (message :string="error de mise à jour")=>{
  ElMessage({
    message:message ,
    showClose:true ,
    type:"error"
  })
}

const doPartnerUpdateRequest = async(partnerData:UpdatePartnerForm)=>{
  const requestData = await supabase.from("partner").update([PartnerRequestMapper.updateFormToRequest(partnerData)]).eq("id" , partnerData.id).select()
  return (loader:any)=>{
    if(!requestData?.error){
      openSucessMessage("partenaire mise à jour avec success")
    }else{
      openErrorMessage(GlobalErrorHandler.process_error(requestData.status))
      setTimeout(()=>loader?.close() , 500)
    }
  }
}

const submitForm = async(formEl : FormInstance | undefined , )=>{
  if(await FormValidator.validate(formEl)){
    const loader =  Loader()
    const _handleError = await doPartnerUpdateRequest(updateCountryForm)
    _handleError(loader)
  }
}



</script>

<template>
  <el-form ref="updateCountryFormRef"  :model="updateCountryForm" :disabled="!props.activateEdition" :rules="rules">
    <el-form-item style="padding-inline: 10px" label="Nom" prop="partner_name">
      <el-input v-model="updateCountryForm.partner_name"/>
    </el-form-item>
    <el-form-item style="padding-inline: 10px" label="abrégé" prop="shortname">
      <el-input v-model="updateCountryForm.shortname"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="--el-color-primary: #026826 ; --el-button-disabled-bg-color: #0fa243 ; --el-button-disabled-border-color: #0fa243  " @click="submitForm(updateCountryFormRef)" :disabled="!props.activateEdition">
        valider
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>