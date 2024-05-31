<!---// @ts-nocheck--->
<script setup lang="ts">


import {reactive, ref} from "vue";
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {ElLoading, FormInstance, FormRules} from "element-plus";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {TownRequestMapper} from "@/components/api/mappers/TownRequestMapper.ts";
import {Logger} from "@/components/utils/Logger.ts";

export interface UpdateTownForm{
  id : number | undefined
  town_name : string
  country_id : number
  activateEdition?:string
}



const props = defineProps<{town:UpdateTownForm , activateEdition:boolean}>()

const updateTownFormRef = ref<FormInstance>()


const updateTownForm = reactive<UpdateTownForm>({
  id:props.town.id ,
  town_name: props.town.town_name ,
  country_id : props.town.country_id ,
  activateEdition : props.town.activateEdition
})

const rules = reactive<FormRules<UpdateTownForm>>({
  town_name: [
    { required: true, message: 'le nom de la  ville est obligatoire', trigger: 'blur' },
  ],
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

const doTownUpdateRequest = async(townData:UpdateTownForm)=>{
  const requestData = await supabase.from("town").update([TownRequestMapper.updateFormToRequest(townData)]).eq("id" , townData.id).select()
  return (loader:any)=>{
    if(!requestData?.error){
      openSucessMessage("ville mise à jour avec success")
      Logger.info("Update town data "+requestData.data)
    }else{
      openErrorMessage(GlobalErrorHandler.process_error(requestData.status))
      Logger.error("Update town data error " + requestData.error)
      setTimeout(()=>loader?.close() , 500)
    }
  }
}

const submitForm = async(formEl : FormInstance | undefined , )=>{
  if(await FormValidator.validate(formEl)){
    const loader =  Loader()
    const _handleError = await doTownUpdateRequest(updateTownForm)
    _handleError(loader)
  }
}



</script>

<template>
  <el-form ref="updateTownFormRef"  :model="updateTownForm" :disabled="!props.activateEdition" :rules="rules">
    <el-form-item style="padding-inline: 10px" label="Nom" prop="country_name">
      <el-input v-model="updateTownForm.town_name"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="--el-color-primary: #026826 ; --el-button-disabled-bg-color: #0fa243 ; --el-button-disabled-border-color: #0fa243  " @click="submitForm(updateTownFormRef)" :disabled="!props.activateEdition">
        valider
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>