
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import supabase from "@/data-source.ts";
import {caveaux, currency, user_action, user_profile} from "@/types/database-types.ts";
import {Logger} from "@/components/utils/Logger.ts";
import CaveauxDetailForm from "@/components/detailsForms/caveaux-detail-form.vue";
import {caveaux_action} from "@/types/database-meta-data.ts";
import {Loader} from "@/components/utils/AppLoader.ts";


const parentBorder = ref(false)
const tableData = ref<currency[]>([])
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


const getCaveauxData = async()=>{
  Loader.showLoader("Suppression des données")
  let { data, error } = await supabase
      .from('caveaux')
      .select(`*`)
  if (error) Logger.error("get caveaux data error " +error)
  else {
    tableData.value = data as caveaux[]
  }
  Loader.hideLoader()
}

const deletCaveaux = async(currentCaveaux :caveaux)=>{
  Loader.showLoader("Suppression des données")
  const {data , error} = await supabase.from("caveaux").delete().eq("id" , currentCaveaux.id).select()
  if(error){
    Logger.error("Delete Caveaux data error "+error)
    ElMessage({
      message : "error de suppression de ce caveaux" ,
      showClose : true ,
      type : "error"
    })
  }else{
    Logger.info("Delete Caveaux data successfully "+data)
    ElMessage({
      message : "Caveaux supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>Loader.hideLoader() , 500)
}


const handleCaveauxDelete = (currenCaveaux : caveaux)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce caveaux  ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletCaveaux(currenCaveaux)
  }).catch(()=>{})
}


onMounted(async()=>{
  supabase.channel("caveaux_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'caveaux'} , async(payload)=>{
    Logger.log("caveaux data changed "+payload)
    await getCaveauxData()
  }).subscribe()
  await getCaveauxData()
})


</script>
<template>
  <!--- @ts-nocheck--->
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826 ; font-family: 'Arial Black';">
      Caveaux
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucun caveaux n'st trouvé">
      <el-table-column type="expand">
        <template #default="props">
          <caveaux-detail-form  :activate-edition="activateEdition" :caveaux="props.row" />
        </template>
      </el-table-column>
      <el-table-column label="Nom du caveaux" prop="caveaux_name" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" @click="toggleEditText"  v-if="userActions?.app_role?.app_action?.some((action)=>action.code.includes(caveaux_action.update))">{{editText}}</el-button>
          <el-button size="small" type="danger" @click="handleCaveauxDelete(props.row)"  v-if="userActions?.app_role?.app_action?.some((action)=>action.code.includes(caveaux_action.delete))">Supprimer</el-button>
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
