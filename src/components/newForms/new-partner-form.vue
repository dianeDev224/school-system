<!---// @ts-nocheck--->
<script setup lang="ts">
import {ref, reactive} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {PartnerRequestMapper} from "@/components/api/mappers/PartnerRequestMapper.ts";
import {Logger} from "@/components/utils/Logger.ts";

const activeNames = ref(['1'])
export interface NewPartnerForm {
  partner_name: string ,
  shortname : string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const newPartanireForm = reactive<NewPartnerForm>({
  partner_name: '',
  shortname : ''
})

const rules = reactive<FormRules<NewPartnerForm>>({
  partner_name: [
    { required: true, message: 'le nom du partenaire est obligatoire', trigger: 'blur' },
  ],
  shortname: [
    { required: true, message: 'le nom abrégé est obligatoire', trigger: 'blur' },
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: 'AJOUT DE PARTENAIRE',
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doNewPartenaireRequest = async ():Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('partner')
      .insert([PartnerRequestMapper.newFormToRequest(newPartanireForm)])
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: 'Nouveau Partenaire',
        message: 'Nouveau Partenaire ajouté avec success',
        type: 'success',
      })
      Logger.info("New Partner Added "+requestData.data)
    }else{
      ElNotification({
        title: 'Nouveau Partenaire',
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("Error When Partner Added "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewPartenaireRequest()
      _handleError(formEl , loader)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


</script>

<template>
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Nouveau partenaire
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newPartanireForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="nom du partenaire" prop="partner_name">
          <el-input v-model="newPartanireForm.partner_name" />
        </el-form-item>
        <el-form-item label="nom abrégé" prop="shortname">
          <el-input v-model="newPartanireForm.shortname" />
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

.el-text{
  font-family: "Arial Black";
}
</style>