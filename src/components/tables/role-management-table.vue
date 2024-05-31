
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import supabase from "@/data-source.ts";
import {app_action, user_profile} from "@/types/database-types.ts";
import {Logger} from "@/components/utils/Logger.ts";
import RoleManagementDetailForm from "@/components/detailsForms/role-management-detail-form.vue";
import {role_action} from "@/types/database-meta-data.ts";
import {Loader} from "@/components/utils/AppLoader.ts";


const parentBorder = ref(false)
const tableData = ref<role[]>([])
const activateEdition = ref(false)
const editText = ref("Modifier")
const userActions = inject<user_profile>("user_actions") ;


const toggleEditText = ()=>{
  if(editText.value==="Modifier"){
    editText.value="fermer"
    activateEdition.value=true
  }else{
    editText.value="Modifier"
    activateEdition.value=false
  }
}


const getRoleData = async()=>{
  Loader.showLoader("Suppression des données")
  let { data, error } = await supabase
      .from('app_role')
      .select(`*`)
  if (error) Logger.error("get role data error " +error)
  else {
    tableData.value = data as role[]
  }
  Loader.hideLoader()
}

const deletRole = async(currentRole : role)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("app_role").delete().eq("id" , currentRole.id).select()
  if(error){
    Logger.error("Delete Rôle data error "+error)
    ElMessage({
      message : "error de suppression de ce Role" ,
      showClose : true ,
      type : "error"
    })
  }else{
    Logger.info("Delete Role data successfully "+data)
    ElMessage({
      message : "Rôle supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}


const handleRoleDelete = (currenFees : role)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce rôle  ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletRole(currenFees)
  }).catch(()=>{})
}


onMounted(async()=>{
  supabase.channel("role_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'user_role'} , async(payload)=>{
    Logger.log("role data changed "+payload)
    await getRoleData()
  }).subscribe()
  await getRoleData()
})


</script>
<template>
  <!---@ts-nocheck--->
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826 ; font-family: 'Arial Black';">
      Gestion des Rôles
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucun pays n'st trouvé">
      <el-table-column type="expand">
        <template #default="props">
          <role-management-detail-form  :activate-edition="activateEdition" :role="props.row" />
        </template>
      </el-table-column>
      <el-table-column :label="'Nom Du Rôle'" prop="role_name" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action.some((action:app_action)=>action.code.includes(role_action.update))">{{editText}}</el-button>
          <el-button size="small" type="danger" @click="handleRoleDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(role_action.delete))">Supprimer</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="center" style="height: 100px">
      <el-pagination background layout="prev, pager, next" :total="tableData?.length/10" />
    </el-row>
  </el-space>
</template>

<style scoped>
.el-table{
  background-color: #ffffff;
}

.el-space{
  width: 100%;
  padding-left: 10px;
  background-color: #ffffff;
}

</style>
