
<script setup lang="ts">
// @ts-nocheck
import {Icon} from "@iconify/vue";
import {ref} from "vue";

import supabase from "@/data-source.ts";
import {Logger} from "@/components/utils/Logger.ts";
import {UpdateRoleForm} from "@/components/detailsForms/role-management-detail-form.vue";
import {app_action, app_action_role} from "@/types/database-types.ts";

const leftCheckbox = ref()
const rightCheckbox = ref()
const activateRightButton = ref(false)
const activateLeftButton = ref(false)
const leftPanelInputsearch = ref("")
const rightPanelInputsearch = ref("")
const selection = ref<app_action_role[] | app_action[]>([])
const allActionModel = defineModel<app_action[]>("allActions")
const roleActionModel = defineModel<app_action_role[]>("roleActions")
const props = defineProps<{role: UpdateRoleForm }>()

const handleLeftPanelChange = (value:all_action[])=>{
  activateRightButton.value = value.length > 0
  selection.value = value
}

const handleRightPanelChange = (value:role_action[])=>{
  activateLeftButton.value = value.length > 0
  selection.value = value
}

const handleRightBtnClick = async()=>{
  for(let item of selection.value as app_action[]){
    await doAddRoleRequest({
      action_id : item?.id ,
      role_id : props.role.id
    })
  }
  activateRightButton.value = false
}

const handleLeftBtnClick = async()=> {
  for(let item of selection.value as app_action_role[]){
    await doRetrieveRoleRequest({
      id : item?.id ,
      role_id : item.role_id ,
      action_id : item?.action_id
    })
  }
  activateLeftButton.value = false
}
const doAddRoleRequest = async(currRoleAction : app_action_role )=>{
  const roleActionRequestData = await supabase.from('app_action_role')
      .upsert(currRoleAction)
      .select();
  if(roleActionRequestData.error){
    Logger.info("Role Action Added successfully "+roleActionRequestData.data)
  }else{
    Logger.info("Role Action Added successfully "+roleActionRequestData.data)
  }
}

const doRetrieveRoleRequest = async(currUserAction : app_action_role )=>{
  const roleActionRequestData = await supabase.from('app_action_role')
      .delete()
      .eq("id" , currUserAction.id)
      .select();
  if(roleActionRequestData.error){
    Logger.info("Role Action Retrieved successfully "+roleActionRequestData.data)
  }else{
    Logger.info("Role Action Retrieved successfully "+roleActionRequestData.data)
  }
}

</script>

<template>
  <!---@ts-nocheck--->
  <el-row>
    <el-space fill="fill">
      <el-col :span="10">
        <el-container>
          <el-card style="max-width: 480px">
            <template #header>
              <el-row>
                <el-text style="color: #F90511">Toutes Les Actions</el-text>
              </el-row>
            </template>
            <el-col>
              <el-input
                  v-model="leftPanelInputsearch"
                  style="max-width: 600px"
                  placeholder="recherche"
              />
              <el-scrollbar height="100px">
                <el-checkbox-group v-model="leftCheckbox" @change="handleLeftPanelChange">
                  <el-checkbox v-for="action of allActionModel.filter((item)=>item.action_name.includes(leftPanelInputsearch) || rightPanelInputsearch == '')" :key="action?.code" :label="action?.action_name" :value="action" />
                </el-checkbox-group>
              </el-scrollbar>
              <el-text v-if="allActionModel?.length === 0">
                aucune action trouvée
              </el-text>
            </el-col>
          </el-card>
        </el-container>
      </el-col>
      <el-col>
        <el-space>
          <el-button type="success"  :disabled="!activateLeftButton" @click="handleLeftBtnClick" >
            <Icon width="20" height="20" icon="mdi-light:chevron-double-left" />
            Enlèvé
          </el-button>
          <el-button type="success" :disabled="!activateRightButton" @click="handleRightBtnClick">
            Ajouté
            <Icon width="20" height="20" icon="mdi-light:chevron-double-right" />
          </el-button>
        </el-space>
      </el-col>
      <el-col :span="10">
        <el-card style="max-width: 480px">
          <template #header>
            <el-row >
              <el-text style="color: #F90511">Les Actions De Ce Rôle</el-text>
            </el-row>
          </template>
          <el-col>
            <el-input
                v-model="rightPanelInputsearch"
                style="max-width: 600px"
                placeholder="recherche"
            >
            </el-input>
            <el-scrollbar  height="100px">
              <el-checkbox-group v-model="rightCheckbox" @change="handleRightPanelChange(rightCheckbox)">
                <el-checkbox v-for="action of roleActionModel?.filter((item)=>item.user_action?.action_name.includes(rightPanelInputsearch) || rightPanelInputsearch == '') " :key="action?.id" :label="action.app_action?.action_name" :value="action" />
              </el-checkbox-group>
            </el-scrollbar>
            <el-text v-if="roleActionModel?.length === 0">aucune action trouvée pour ce rôle</el-text>
          </el-col>
        </el-card>
      </el-col>
    </el-space>
  </el-row>
</template>

<style scoped>

</style>