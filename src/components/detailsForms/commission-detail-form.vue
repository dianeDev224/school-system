
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import {country} from "@/types/database-types.ts";
import {CommissionRequestMapper} from "@/components/api/mappers/CommissionRequestMapper.ts";



const activeNames = ref(['1'])
export interface UpdateCommissionForm {
  id:number
  base_country_id: number
  target_country_id: number
  base_country_rate: number
  target_country_rate: number
  base_country : country
  target_country : country
}

const props = defineProps<{commission: UpdateCommissionForm , activateEdition:boolean}>()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const updateCommissionForm = reactive<UpdateCommissionForm>({
  id: props.commission.id,
  base_country_id: props.commission.base_country_id,
  target_country_id: props.commission.target_country_id,
  base_country_rate : props.commission.base_country_rate,
  target_country_rate : props.commission.target_country_rate ,
  base_country : props.commission.base_country ,
  target_country : props.commission.target_country
})
const countryData = ref([])

const rules = reactive<FormRules<UpdateCommissionForm>>({
  base_country_id: [
    { required: true, message: 'le  pays de base est obligatoire', trigger: 'blur' },
  ],
  target_country_id: [
    { required: true, message: 'le pays de destination est obligatoire', trigger: 'change'},
  ],
  base_country_rate: [
    { required: true, message: "le pourcentage de l'agence d'origine  est obligatoire", trigger: 'change'},
  ] ,
  target_country_rate: [
    { required: true, message: "le pourcentage de l'agence de destination est obligatoire", trigger: 'change'},
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DE FRAIS",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doUpdateCommissionRequest = async (commissionData : UpdateCommissionForm):Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  console.log(updateCommissionForm)
  const requestData =  await supabase.from('commission')
      .update([CommissionRequestMapper.updateFormToRequest(commissionData)])
      .eq("id" , commissionData.id)
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Mise à jour de la commission",
        message: "la commission à  été mise à jour avec success",
        type: 'success',
      })
      Logger.info("Feess Updated successfully "+requestData.data)
    }else{
      ElNotification({
        title: "Mise à jour de la commission",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("Commission Update Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doUpdateCommissionRequest(updateCommissionForm)
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
  <!--- @ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">Détails</el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="updateCommissionForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item label="pays de base" prop="base_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de base" v-model="updateCommissionForm.base_country_id">
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
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="updateCommissionForm.target_country_id">
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
        <el-form-item label="pourcentage de l'agence d'origine (%)" prop="base_country_rate">
          <el-input v-model="updateCommissionForm.base_country_rate" type="number" />
        </el-form-item>
        <el-form-item label="pourcentage de l'agence de destination (%)" prop="target_country_rate">
          <el-input v-model="updateCommissionForm.target_country_rate" type="number" />
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