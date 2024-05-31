


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

const activeNames = ref(['1'])
export interface NewCurrencyForm {
  base_country_id: number
  target_country_id: number
  currency: number
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const newCurrencyForm = reactive<NewCurrencyForm>({
  base_country_id: '',
  target_country_id: '',
  currency: '',
})
const countryData = ref<country[]>([])

const rules = reactive<FormRules<NewCurrencyForm>>({
  base_country_id: [
    { required: true, message: 'le  pays de base est obligatoire', trigger: 'blur' },
  ],
  target_country_id: [
    { required: true, message: 'le pays de destination est obligatoire', trigger: 'change'},
    {validator : FormValidator.shouldNotBeEqual(newCurrencyForm.base_country_id), trigger: 'change'},
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

const doNewCurrencyRequest = async ():Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('currency')
      .insert([CurrencyRequestMapper.newFormToRequest(newCurrencyForm)])
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Nouveau Taux D'échange",
        message: "Nouveau taux d'échange ajouté avec success",
        type: 'success',
      })
      Logger.info("New Currency Added "+requestData.data)
    }else{
      ElNotification({
        title: "Nouveau Taux D'échange ",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("New Currency Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewCurrencyRequest()
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
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">
          Nouveau Taux d'échange
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newCurrencyForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="pays d'origine" prop="base_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays d'origine" v-model="newCurrencyForm.base_country_id">
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
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="newCurrencyForm.target_country_id">
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
          <el-input v-model="newCurrencyForm.currency" type="number" />
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