
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import {FeeRequestMappper} from "@/components/api/mappers/FeeRequestMappper.ts";
import {AppItems} from "@/components/utils/AppItems.ts";
import {country} from "@/types/database-types.ts";



const activeNames = ref(['1'])
export interface UpdateFeesForm {
  id:number
  base_country_id: number
  target_country_id: number
  fees_type: number
  lower_bound: number
  upper_bound : number
  fees : number
  base_country: country
  target_country: country
}

const props = defineProps<{fees: UpdateFeesForm , activateEdition:boolean}>()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const updateFeesForm = reactive<UpdateFeesForm>({
  id: props.fees.id,
  base_country_id: props.fees.base_country_id,
  target_country_id: props.fees.target_country_id,
  fees_type : props.fees.fees_type,
  fees: props.fees.fees,
  lower_bound : props.fees.lower_bound,
  upper_bound : props.fees.upper_bound ,
  base_country : props.fees.base_country ,
  target_country : props.fees.target_country
})
const countryData = ref<country[]>([])

const rules = reactive<FormRules<UpdateFeesForm>>({
  base_country_id: [
    { required: true, message: 'le  pays de base est obligatoire', trigger: 'blur' },
  ],
  target_country_id: [
    { required: true, message: 'le pays de destination est obligatoire', trigger: 'change'},
  ],
  fees_type: [
    { required: true, message: 'le type de frais est obligatoire', trigger: 'change'},
  ] ,
  fees: [
    { required: true, message: 'la valeur du frais est obligatoire', trigger: 'change'},
  ] ,
  lower_bound : [
    { required: true, message: 'la borne inferieur est obligatoire', trigger: 'change'},
  ] ,
  upper_bound : [
    { required: true, message: 'la borne superieur est obligatoire', trigger: 'change'},
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DE FRAIS",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doUpdateCurrencyRequest = async (feesData : UpdateFeesForm):Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('fees')
      .update([FeeRequestMappper.updateFormToRequest(feesData)])
      .eq("id" , feesData.id)
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Mise à jour de frais",
        message: "le frais à  été mise à jour avec success",
        type: 'success',
      })
      Logger.info("Feess Updated successfully "+requestData.data)
    }else{
      ElNotification({
        title: "Mise à jour de frais",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("Fees Update Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doUpdateCurrencyRequest(updateFeesForm)
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
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">Détails</el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="updateFeesForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item label="pays de base" prop="base_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de base" v-model="updateFeesForm.base_country_id">
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
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="updateFeesForm.target_country_id">
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
        <el-form-item :label="'borne inferieure ('+updateFeesForm.base_country?.currency+')'" prop="currency">
          <el-input v-model="updateFeesForm.lower_bound" type="number" />
        </el-form-item>
        <el-form-item :label="'borne superieure ('+updateFeesForm.base_country?.currency+')'" prop="currency">
          <el-input v-model="updateFeesForm.upper_bound" type="number" />
        </el-form-item>
        <el-form-item label="type de frais" prop="fees_type">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun type de frais trouvé" placeholder="type de frais" v-model="updateFeesForm.fees_type">
            <el-option
                v-for="item in AppItems.getFeesTypeItem()"
                :key="item?.code"
                :label="item?.name"
                :value="item?.code"
            >
              <el-space>
                <el-text size="small">
                  {{item?.name}}-{{item?.symbol}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'valeur du frais ('+(updateFeesForm.fees_type === 1 ? updateFeesForm.base_country.currency : '%') +')'" prop="currency">
          <el-input v-model="updateFeesForm.fees" type="number" />
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