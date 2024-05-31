<script setup lang="ts">
// @ts-nocheck
import {ref , reactive} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {CountryRequestMapper} from "@/components/api/mappers/CountryRequestMapper.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import NbreTransactionTable from "@/components/tables/nbre-transaction-table.vue";
import MonthBilanTable from "@/components/tables/month-bilan-table.vue";
import MonthResultTable from "@/components/tables/month-result-table.vue";
import TransfertAnnulerTable from "@/components/tables/transfert-annuler-table.vue";
import TransfertEmisTable from "@/components/tables/transfert-emis-table.vue";

const activeNames = ref(['1'])
export interface NewCountryForm {
  name: string
  code: string
  capital: string
  shortname: string
  currency: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const newCountryForm = reactive<NewCountryForm>({
  name: '',
  code: '',
  capital: '',
  shortname: '',
  currency: ''
})

const rules = reactive<FormRules<NewCountryForm>>({
  name: [
    { required: true, message: 'le nom du pays est obligatoire', trigger: 'blur' },
  ],
  code: [
    {
      required: true,
      message: 'le code du pays est obligatoire',
      trigger: 'change',
    },
  ],
  capital: [
    {
      required: true,
      message: 'la capitale du pays est obligatoire',
      trigger: 'change',
    },
  ],
  shortname: [
    {
      required: true,
      message: 'le dimunitif du pays est obigaoire ',
      trigger: 'change',
    },
  ],
  currency: [
    {
      required: true,
      message: 'la monnaie du pays est obligatoire',
      trigger: 'change',
    },
  ]
})

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: 'AJOUT DU PAYS',
    background: 'rgba(0, 0, 0, 0.7)',

  })
}

const doNewCountryRequest = async ():Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('country')
      .insert([CountryRequestMapper.newFormToRequest(newCountryForm)])
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: 'Nouveau Pays',
        message: 'Nouveau Pays ajouté avec success',
        type: 'success',
      })
    }else{
      ElNotification({
        title: 'Nouveau Pays',
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
    }
    setTimeout(()=>loader?.close() , 600)

  }
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewCountryRequest()
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
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1"  style="">
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Transferts emis
        </el-text>
      </template>
      <el-space direction="vertical" fill="fill" style="width: 100%">
        <transfert-emis-table/>
      </el-space>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.el-collapse{
  background-color: #ffffff;
  padding-inline: 5px;
}

.el-text{
  font-family: "Arial Black";
}
</style>