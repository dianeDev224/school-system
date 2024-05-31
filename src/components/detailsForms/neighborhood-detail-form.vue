<!---// @ts-nocheck--->
<script setup lang="ts">


import {reactive, ref} from "vue";
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {ElLoading, FormInstance, FormRules} from "element-plus";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {Logger} from "@/components/utils/Logger.ts";
import {NeighborhoodRequestMapper} from "@/components/api/mappers/NeighborhoodRequestMapper.ts";


export interface UpdateNeighborhoodForm{
  id : number | undefined
  neighborhood_name : string
  town_id : number
  activateEdition?:string
}



const props = defineProps<{neighborhood:UpdateNeighborhoodForm , activateEdition:boolean}>()

const updateNeighborhoodFormRef = ref<FormInstance>()


const updateNeighborhoodForm = reactive<UpdateNeighborhoodForm>({
  id:props.neighborhood.id ,
  neighborhood_name: props.neighborhood.neighborhood_name ,
  town_id : props.neighborhood.town_id ,
  activateEdition : props.neighborhood.activateEdition
})

const rules = reactive<FormRules<UpdateNeighborhoodForm>>({
  neighborhood_name: [
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

const doNeighborhoodUpdateRequest = async(neighborhoodData:UpdateNeighborhoodForm)=>{
  const requestData = await supabase.from("neighborhood").update([NeighborhoodRequestMapper.updateFormToRequest(neighborhoodData)]).eq("id" , neighborhoodData.id).select()
  return (loader:any)=>{
    if(!requestData?.error){
      openSucessMessage("quartier mise à jour avec success")
      Logger.info("Update neighborhood data "+requestData.data)
    }else{
      openErrorMessage(GlobalErrorHandler.process_error(requestData.status))
      Logger.error("Update neighborhood data error " + requestData.error)
      setTimeout(()=>loader?.close() , 500)
    }
  }
}

const submitForm = async(formEl : FormInstance | undefined)=>{
  if(await FormValidator.validate(formEl)){
    const loader =  Loader()
    const _handleError = await doNeighborhoodUpdateRequest(updateNeighborhoodForm)
    _handleError(loader)
  }
}



</script>

<template>
  <el-form ref="updateNeighborhoodFormRef"  :model="updateNeighborhoodForm" :disabled="!props.activateEdition" :rules="rules">
    <el-form-item style="padding-inline: 10px" label="Nom" prop="neighborhood_name">
      <el-input v-model="updateNeighborhoodForm.neighborhood_name"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="--el-color-primary: #026826 ; --el-button-disabled-bg-color: #0fa243 ; --el-button-disabled-border-color: #0fa243  " @click="submitForm(updateNeighborhoodFormRef)" :disabled="!props.activateEdition">
        valider
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>