
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import {FormValidator} from "@/components/utils/FormValidator.ts";
import {AppItems} from "@/components/utils/AppItems.ts";
import {PartnerFeesRequestMappper} from "@/components/api/mappers/PartnerFeesRequestMappper.ts";
import {country} from "@/types/database-types.ts";

const activeNames = ref(['1'])
export interface NewFeesForm {
  partner_id : number
  base_country_id: number
  target_country_id: number
  fees: number
  fees_type: number
  lower_bound: number
  upper_bound: number
}

const props = defineProps<{partner_id : number}>()
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const newPartnerFeesForm = reactive<NewFeesForm>({
  partner_id : props.partner_id ,
  base_country_id: '',
  target_country_id: '',
  fees : '' ,
  fees_type : '' ,
  lower_bound : '' ,
  upper_bound : ''
})
const countryData = ref<country[]>([])

const rules = reactive<FormRules<NewFeesForm>>({
  base_country_id: [
    { required: true, message: 'le  pays de base est obligatoire', trigger: 'blur' },
  ],
  target_country_id: [
    { required: true, message: 'le pays de destination est obligatoire', trigger: 'change'},
    {validator : FormValidator.shouldNotBeEqual(newPartnerFeesForm.base_country_id), trigger: 'change'},
  ],
  fees: [
    { required: true, message: 'la valeur du frais est obligatoire', trigger: 'change'},
  ] ,
  fees_type: [
    { required: true, message: 'le type de frais est obligatoire', trigger: 'change'},
  ] ,
  lower_bound: [
    { required: true, message: 'la borne inferieur est obligatoire', trigger: 'change'},
  ] ,
  upper_bound: [
    { required: true, message: 'la borne superieur est obligatoire', trigger: 'change'},
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DU Taux D'échange",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doNewPartnerFeesRequest = async ():Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('partner_fees')
      .insert([PartnerFeesRequestMappper.newFormToRequest(newPartnerFeesForm)])
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Nouveau Frais Partenaire",
        message: "Le Nouveau frais partenaire  ajouté avec success",
        type: 'success',
      })
      Logger.info("New PartnerFees Added "+requestData.data)
    }else{
      ElNotification({
        title: "Nouveau Frais Partenaire",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("New PartnerFees Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewPartnerFeesRequest()
      _handleError(formEl , loader)
      console.log(newPartnerFeesForm)
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
          Nouveau Frais
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newPartnerFeesForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="pays de base" prop="base_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de base" v-model="newPartnerFeesForm.base_country_id">
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
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="newPartnerFeesForm.target_country_id">
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
        <el-form-item label="type de frais" prop="fees_type">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun type de frais trouvé" placeholder="type de frais" v-model="newPartnerFeesForm.fees_type">
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
        <el-form-item label="borne inferieur" prop="lower_bound">
          <el-input v-model="newPartnerFeesForm.lower_bound" type="number" />
        </el-form-item>
        <el-form-item label="borne superieure" prop="upper_bound">
          <el-input v-model="newPartnerFeesForm.upper_bound" type="number" />
        </el-form-item>
        <el-form-item label="la valeur du frais" prop="fees">
          <el-input v-model="newPartnerFeesForm.fees" type="number" />
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