<!---// @ts-nocheck--->
<script setup lang="ts">
import {ref , reactive} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {TownRequestMapper} from "@/components/api/mappers/TownRequestMapper.ts";

const activeNames = ref(['1'])

const props = defineProps<{country_id:number}>()

export interface NewTownForm {
  name: string
  country_id:number
}

const ruleFormRef = ref<FormInstance>()
const newTownForm = reactive<NewTownForm>({
  name: '',
  country_id: props.country_id
})

const rules = reactive<FormRules<NewTownForm>>({
  name: [
    { required: true, message: 'le nom de la ville est obligatoire', trigger: 'blur' },
  ]
})

const doNewTownRequest = async(): Promise<(formEl: (FormInstance | undefined), loader: any) => void>=>{
  const requestData = await supabase
      .from('town')
      .insert([TownRequestMapper.newFormToRequest(newTownForm)])
      .select()
  return (formEl: FormInstance | undefined , loader:any)=>{
    if(!requestData.error){
      ElNotification({
        title: 'Nouveelle Ville',
        message: 'Nouvelle Ville ajoutée avec success',
        type: 'success',
      })
      resetForm(formEl)
    }else{
      ElNotification({
        title: 'Nouvelle Ville',
        message: "error d'enregistrement de cette ville "+requestData.error.message,
        type: 'error',
      })
    }
    setTimeout(()=>loader?.close() , 500)
  }
}

const Loader = (text:string="AJOUT DES DONNEES")=>{
  return ElLoading.service({
    lock:false,
    text:text,
    background : 'rgba(0 ,0 ,0 , 0.7)'
  })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewTownRequest()
      _handleError(formEl , loader)
      resetForm(formEl)
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
  <el-collapse v-model="activeNames"  style="border: none">
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Nouvelle ville
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newTownForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          status-icon
      >
        <el-form-item label="nom de la ville" prop="name">
          <el-input v-model="newTownForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="--el-color-primary: #026826"   @click="submitForm(ruleFormRef)">
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