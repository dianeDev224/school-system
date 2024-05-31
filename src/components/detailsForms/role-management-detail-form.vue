
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {Logger} from "@/components/utils/Logger.ts";
import {app_action, app_action_role, user_action} from "@/types/database-types.ts";
import ActionSelectorTransfert from "@/components/action-selector-transfert.vue";
import {RoleRequestMapper} from "@/components/api/mappers/RoleRequestMapper.ts";



const activeNames = ref(['1'])
const allActions = ref<app_action[]>([])
const roleActions = ref<app_action_role[]>([])
export interface UpdateRoleForm {
  id:number
  role_name : string
}

const props = defineProps<{role: UpdateRoleForm , activateEdition:boolean}>()

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const updateRoleForm = reactive<UpdateRoleForm>({
  id: props.role.id,
  role_name: props.role.role_name,
})

const rules = reactive<FormRules<UpdateRoleForm>>({
  role_name: [
    { required: true, message: 'le  nom du rôle est obligatoire', trigger: 'blur' },
  ]
})

const getAllActionsData = async() => {
  let { data, error } = await supabase
      .from('app_action')
      .select()
  allActions.value = data as all_action[]
  roleActions.value?.map((role_action)=>{
    allActions.value = allActions.value?.filter((all_action)=>role_action.action_id != all_action.id)
  })
}

const getRoleActionsData = async() => {
  let { data, error } = await supabase
      .from('app_action_role')
      .select(`
        * ,
        app_action:action_id(*) ,
        app_role:role_id(*)
      `).eq("role_id" , updateRoleForm.id)
  roleActions.value = data as app_action_role[]
}

const Loader = ()=>{
  return ElLoading.service({
    lock: true,
    text: "AJOUT DE FRAIS",
    background: 'rgba(0, 0, 0, 0.7)',

  })
}


const doUpdateRoleRequest = async (roleData : UpdateRoleForm):Promise<(formInstnace: (FormInstance | undefined), loader: any) => void>=>{
  const requestData =  await supabase.from('app_role')
      .update([RoleRequestMapper.updateFormToRequest(roleData)])
      .eq("id" , roleData.id)
      .select();
  return (formInstnace : FormInstance | undefined , loader: any)=>{
    if(!requestData.error && !roleActionRequestData.error){
      resetForm(formInstnace)
      ElNotification({
        title: "Mise à jour du rôle",
        message: "le rôle  à  été mise à jour avec success",
        type: 'success',
      })
      Logger.info("Role Updated successfully "+requestData.data)
    }else{
      ElNotification({
        title: "Mise à jour du rôle",
        message: GlobalErrorHandler.process_error(requestData.status),
        type: 'error',
      })
      Logger.error("Role Update Error "+requestData.error)
    }
    setTimeout(()=>loader?.close() , 600)

  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      const loader = Loader()
      const _handleError = await doUpdateRoleRequest(updateRoleForm)
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

onMounted(async()=>{
  supabase.channel("role_actions_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'app_action_role'} , async(payload)=>{
    console.log("LOG : Request Data from user role actions change " , payload)
    await getRoleActionsData()
    await getAllActionsData()
  }).subscribe()
  supabase.channel("all_actions_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'app_action'} , async(payload)=>{
    console.log("LOG : Request Data from all actions change " , payload)
    await getRoleActionsData()
    await getAllActionsData()
  }).subscribe()
  await getRoleActionsData()
  await getAllActionsData()
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
          :model="updateRoleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item label="Détail du rôle" prop="base_country_id">
          <el-space direction="vertical" fill="fill">
            <el-input v-model="updateRoleForm.role_name" :disabled="!props.activateEdition"></el-input>
            <action-selector-transfert :role="updateRoleForm" v-model:all-actions="allActions" v-model:role-actions="roleActions"/>
          </el-space>
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

.el-transfer__buttons{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  }
</style>