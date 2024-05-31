
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {FeeRequestMappper} from "@/components/api/mappers/FeeRequestMappper.ts";
import {CommissionRequestMapper} from "@/components/api/mappers/CommissionRequestMapper.ts";
import {country} from "@/types/database-types.ts";

const activeNames = ref(['1'])
export interface NewCommissionForm {
  base_country_id: number
  target_country_id: number
  base_country_rate: number
  target_country_rate: number
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const newCommissionForm = reactive<NewCommissionForm>({
  base_country_id: '',
  target_country_id: '',
  base_country_rate : '' ,
  target_country_rate : '' ,
})
const countryData = ref<country[]>([])

const rules = reactive<FormRules<NewCommissionForm>>({
  base_country_id: [
    { required: true, message: 'le  pays de base est obligatoire', trigger: 'blur' },
  ],
  target_country_id: [
    { required: true, message: 'le pays de destination est obligatoire', trigger: 'change'},
    {validator : FormValidator.shouldNotBeEqual(newCommissionForm.base_country_id), trigger: 'change'},
  ],
  base_country_rate: [
    { required: true, message: 'le pourcentage du pays de d \'origine est obligatoire', trigger: 'change'},
  ] ,
  target_country_rate: [
    { required: true, message: 'le pourcentage du pays de destination est obligatoire', trigger: 'change'},
  ] ,
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DE COMMISSION",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doNewCommissionRequest = async ():Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('commission')
      .insert([CommissionRequestMapper.newFormToRequest(newCommissionForm)])
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Nouvelle Commission",
        message: "La Nouvelle commission  ajoutée avec success",
        type: 'success',
      })
      Logger.info("New Commission Added "+requestData.data)
    }else{
      ElNotification({
        title: "Nouvelle Commission",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("New Commission Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewCommissionRequest()
      _handleError(formEl , loader)
      console.log(newCommissionForm)
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

const getCountry = async ()=>{
  let { data, error } = await supabase
      .from('country')
      .select(`*`)
  if (error) console.error(error)
  else {
    countryData.value = data
  }
}

onMounted(async()=>{
  await getCountry()
})

</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">
          Nouvelle Commission
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newCommissionForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="pays de d'origine" prop="base_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de base" v-model="newCommissionForm.base_country_id">
            <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.country_name"
                :value="item.id"
            >
              <el-space>
                <country-flag :image-name="item.shortname.toLowerCase()"/>
                <el-text size="small">
                  {{item?.country_name.toUpperCase()}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="pays de destination" prop="target_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="newCommissionForm.target_country_id">
            <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.country_name"
                :value="item.id"
            >
              <el-space>
                <country-flag :image-name="item.shortname?.toLowerCase()"/>
                <el-text size="small">
                  {{item?.country_name?.toUpperCase()}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="pourcentage de l'agence de d'origine" prop="base_country_rate">
          <el-input v-model="newCommissionForm.base_country_rate" type="number" />
        </el-form-item>
        <el-form-item label="pourcentage de l'agence de destination" prop="target_country_rate">
          <el-input v-model="newCommissionForm.target_country_rate" type="number" />
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