
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {Logger} from "@/components/utils/Logger.ts";
import {CaveauxRequestMapper} from "@/components/api/mappers/CaveauxRequestMapper.ts";

const activeNames = ref(['1'])
export interface NewCaveauxForm {
  caveaux_name: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const newCaveauxForm = reactive<NewCaveauxForm>({
  caveaux_name: '',
})

const rules = reactive<FormRules<NewCaveauxForm>>({
  nom_caveaux: [
    { required: true, message: 'le nom est obligatoire', trigger: 'blur' },
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DU CAVEAUX",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doNewCaveauxRequest = async ():Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('caveaux')
      .insert([CaveauxRequestMapper.newFormToRequest(newCaveauxForm)])
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Nouveau Caveaux D'agence",
        message: "Le Nouveau caveaux  ajouté avec success",
        type: 'success',
      })
      Logger.info("New Caveaux Added "+requestData.data)
    }else{
      ElNotification({
        title: "Nouveau Caveaux D'agence",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("New Caveaux Error "+requestData.error)
      console.log(requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewCaveauxRequest()
      _handleError(formEl , loader)
      console.log(newCaveauxForm)
      setTimeout(()=>loader?.close() , 600)
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
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">
          Nouveau Caveaux
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newCaveauxForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="Nom" prop="caveaux_name">
          <el-input v-model="newCaveauxForm.caveaux_name" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="--el-color-primary: #026826"  @click="submitForm(ruleFormRef)">
            continuer
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">annuler</el-button>
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