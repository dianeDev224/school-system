
<script setup lang="ts">
// @ts-nocheck
import {inject, reactive, ref} from "vue";
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {ElLoading, FormInstance, FormRules} from "element-plus";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {CountryRequestMapper} from "@/components/api/mappers/CountryRequestMapper.ts";
import {user_action, user_profile} from "@/types/database-types.ts";
import {country_action} from "@/types/database-meta-data.ts";

export interface UpdateCountryForm{
  id : number | undefined
  country_name : string
  capital : string
  code : string
  currency : string
  shortname : string
  activateEdition?:string
}



const props = defineProps<{country:UpdateCountryForm , activateEdition:boolean}>()
const updateCountryFormRef = ref<FormInstance>()
const userActions = inject<user_profile>("user_actions") ;
const updateCountryForm = reactive<UpdateCountryForm>({
  id:props.country.id ,
  country_name: props.country.country_name ,
  capital : props.country.capital ,
  shortname : props.country.shortname ,
  currency : props.country.currency ,
  code : props.country.code ,
  activateEdition : props.country.activateEdition
})

const rules = reactive<FormRules<UpdateCountryForm>>({
  country_name: [
    { required: true, message: 'le nom du pays est obligatoire', trigger: 'blur' },
  ],
  code: [
    {required: true,message: 'le code du pays est obligatoire',trigger: 'change'},
  ],
  capital: [
    {required: true,message: 'la capitale du pays est obligatoire',trigger: 'change'},
  ],
  shortname: [
    {required: true,message: 'le dimunitif du pays est obigaoire ' ,trigger: 'change'},
  ],
  currency: [
    {required: true,message: 'la monnaie du pays est obligatoire',trigger: 'change'},
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

const doCountryUpdateRequest = async(countryData:UpdateCountryForm)=>{
  const requestData = await supabase.from("country").update([CountryRequestMapper.updateFormToRequest(countryData)]).eq("id" , countryData.id).select()
  return (loader:any)=>{
    if(!requestData?.error){
      openSucessMessage("pays mise à jour avec success")
    }else{
      openErrorMessage(GlobalErrorHandler.process_error(requestData.status))
      setTimeout(()=>loader?.close() , 500)
    }
  }
}

const submitForm = async(formEl : FormInstance | undefined , )=>{
  if(await FormValidator.validate(formEl)){
    const loader =  Loader()
    const _handleError = await doCountryUpdateRequest(updateCountryForm)
    _handleError(loader)
  }
}



</script>

<template>
  <!---@ts-nocheck--->
  <el-form ref="updateCountryFormRef"  :model="updateCountryForm" :disabled="!props.activateEdition" :rules="rules">
    <el-form-item style="padding-inline: 10px" label="Nom" prop="country_name">
      <el-input v-model="updateCountryForm.country_name"/>
    </el-form-item>
    <el-form-item style="padding-inline: 10px" label="Code" prop="code">
      <el-input v-model="updateCountryForm.code"/>
    </el-form-item>
    <el-form-item style="padding-inline: 10px" label="Capital" prop="capital">
      <el-input v-model="updateCountryForm.capital"/>
    </el-form-item>
    <el-form-item style="padding-inline: 10px" label="Diminutif" prop="shortname">
      <el-input v-model="updateCountryForm.shortname"/>
    </el-form-item>
    <el-form-item style="padding-inline: 10px" label="Monnaie" prop="currency">
      <el-input v-model="updateCountryForm.currency"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-if="userActions?.app_role?.app_action?.some((action)=>action.code.includes(country_action.update))" style="--el-color-primary: #026826 ; --el-button-disabled-bg-color: #0fa243 ; --el-button-disabled-border-color: #0fa243  " @click="submitForm(updateCountryFormRef)" :disabled="!props.activateEdition">
        valider
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>