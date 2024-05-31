
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {Logger} from "@/components/utils/Logger.ts";
import {CaveauxRequestMapper} from "@/components/api/mappers/CaveauxRequestMapper.ts";



const activeNames = ref(['1'])
export interface UpdateCaveauxForm {
  id:number
  caveaux_name : string
}

const props = defineProps<{caveaux: UpdateCaveauxForm , activateEdition:boolean}>()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const updateCaveauxForm = reactive<UpdateCaveauxForm>({
  id: props.caveaux.id,
  caveaux_name: props.caveaux.caveaux_name,
})
const countryData = ref([])

const rules = reactive<FormRules<UpdateCaveauxForm>>({
  caveaux_name: [
    { required: true, message: 'le  nom du caveaux est obligatoire', trigger: 'blur' },
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DE FRAIS",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doUpdateCaveauxRequest = async (caveauxData : UpdateCaveauxForm):Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('caveaux')
      .update([CaveauxRequestMapper.updateFormToRequest(caveauxData)])
      .eq("id" , caveauxData.id)
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Mise à jour de caveaux",
        message: "le caveaux à  été mise à jour avec success",
        type: 'success',
      })
      Logger.info("caveaux Updated successfully "+requestData.data)
    }else{
      ElNotification({
        title: "Mise à jour de caveaux",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("Caveaux Update Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doUpdateCaveauxRequest(updateCaveauxForm)
      _handleError(formEl , loader)
    } else {
      Logger.error('submission error ' +fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">Détails</el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="updateCaveauxForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item label="nom du caveaux" prop="caveaux_name">
          <el-input v-model="updateCaveauxForm.caveaux_name" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!props.activateEdition" type="primary" style="--el-color-primary: #026826"  @click="submitForm(ruleFormRef)">
            valider
          </el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.el-collapse{
  background-color: #ffffff;
  padding-left: 10px;
}
</style>