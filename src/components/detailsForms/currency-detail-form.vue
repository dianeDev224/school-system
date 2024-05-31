
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {CurrencyRequestMapper} from "@/components/api/mappers/CurrencyRequestMapper.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {country} from "@/types/database-types.ts";



const activeNames = ref(['1'])
export interface UpdateCurrencyForm {
  id:number
  base_country_id: number
  target_country_id: number
  currency: number
  base_country : country
  target_country : country
}

const props = defineProps<{currency: UpdateCurrencyForm , activateEdition:boolean}>()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const updateCurrencyForm = reactive<UpdateCurrencyForm>({
  id: props.currency.id,
  base_country_id: props.currency.base_country_id,
  target_country_id: props.currency.target_country_id,
  currency: props.currency.currency,
})
const countryData = ref([])

const rules = reactive<FormRules<UpdateCurrencyForm>>({
  base_country_id: [
    { required: true, message: 'le  pays de base est obligatoire', trigger: 'blur' },
  ],
  target_country_id: [
    { required: true, message: 'le pays de destination est obligatoire', trigger: 'change'},
    {validator : FormValidator.shouldNotBeEqual(updateCurrencyForm.base_country_id), trigger: 'change'},
  ],
  currency: [
    { required: true, message: 'la valeur du taux est obligatoire', trigger: 'change'},
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DU Taux D'échange",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doUpdateCurrencyRequest = async (currencyData : UpdateCurrencyForm):Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('currency')
      .update([CurrencyRequestMapper.updateFormToRequest(currencyData)])
      .eq("id" , currencyData.id)
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Mise à jour du  taux d'échange",
        message: "le taux d'échange été mise à jour avec success",
        type: 'success',
      })
      Logger.info("Currency Updated successfully "+requestData.data)
    }else{
      ElNotification({
        title: "Mise à jour du  taux d'échange",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("Currency Update Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doUpdateCurrencyRequest(updateCurrencyForm)
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
          :model="updateCurrencyForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item :label="'pays de base ('+props.currency.base_country?.currency+')'" prop="base_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de base" v-model="updateCurrencyForm.base_country_id">
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
        <el-form-item :label="'pays de destination ('+props.currency.target_country?.currency+')'" prop="target_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="updateCurrencyForm.target_country_id">
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
        <el-form-item label="la valeur du taux" prop="currency">
          <el-input v-model="updateCurrencyForm.currency" type="number" />
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