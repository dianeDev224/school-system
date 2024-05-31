

<script setup lang="ts">
// @ts-nocheck
import {ref , reactive} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {NeighborhoodRequestMapper} from "@/components/api/mappers/NeighborhoodRequestMapper.ts";


const props = defineProps<{town_id : number}>()
const activeNames = ref(['1'])


export interface NewNeighborhoodForm {
  name: string
  town_id:number
}

const formSize = ref('default')
const newNeighborhoodFormRef = ref<FormInstance>()
const newNeighborhoodForm = reactive<NewNeighborhoodForm>({
  name: '',
  town_id : props.town_id
})

const newNeighborhoodFormRule = reactive<FormRules<NewNeighborhoodForm>>({
  name: [
    { required: true, message: 'le nom du quartier est obligatoire', trigger: 'blur' },
  ]
})

const Loader = (text : string = "ENREGISTREMENT DU QUARTIER")=>{
  return ElLoading.service({
    lock:false ,
    text : text ,
    background:'rgba(0,0,0, 0.7)'
  })
}

const doNewNeighborhoodRequest = async():Promise<(formEl: (FormInstance | undefined), loader: any) => void>=>{
  const requestData = await supabase
      .from("neighborhood")
      .insert([NeighborhoodRequestMapper.newFormToRequest(newNeighborhoodForm)])
      .select()
    return (formEl : FormInstance | undefined , loader:any)=>{
      if(!requestData.error){
        ElNotification({
          title:"Nouveau Quartier",
          message:"nouveau quartier enregistré avec success" ,
          type:"success"
        })
        resetForm(formEl)
      }else{
        ElNotification({
          title:"Nouveau Quartier" ,
          message : "Error lors de l'enregistrement du nouveau quartier "+requestData.error.message ,
          type : "error"
        })
      }

      setTimeout(()=>loader?.close() , 500)
    }
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doNewNeighborhoodRequest()
      _handleError(formEl , loader )
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
  <!--- @ts-nocheck--->
  <el-collapse v-model="activeNames"  style="border: none">
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Nouveau Quartier
        </el-text>
      </template>
      <el-form
          ref="newNeighborhoodFormRef"
          style="max-width: 600px"
          :model="newNeighborhoodForm"
          :rules="newNeighborhoodFormRule"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="nom du quartier" prop="name">
          <el-input v-model="newNeighborhoodForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="--el-color-primary: #026826"   @click="submitForm(newNeighborhoodFormRef)">
            continuer
          </el-button>
          <el-button @click="resetForm(newNeighborhoodFormRef)">annuler</el-button>
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