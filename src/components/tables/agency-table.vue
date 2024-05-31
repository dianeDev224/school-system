
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import supabase from "@/data-source.ts";
import {
  agency,
  app_action,
  country,
  user_profile
} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {agency_action} from "@/types/database-meta-data.ts";
import SubscriptionDetailForm from "@/components/detailsForms/subscription-detail-form.vue";
import {SubscriptionService} from "@/components/api/subscription.service.ts";
import {Loader} from "@/components/utils/AppLoader.ts";
import {Logger} from "@/components/utils/Logger.ts";
import {AgencyService} from "@/components/api/agency.service.ts";
import AgencyDetailForm from "@/components/detailsForms/agency-detail-form.vue";


const parentBorder = ref(false)
const tableData = ref<agency[]>([])
const activateEdition = ref(false)
const editText = ref("Edit")
const userActions = inject<user_profile>("user_actions") ;


const toggleEditText = ()=>{
  if(editText.value==="Edit"){
    editText.value="fermer"
    activateEdition.value=true
  }else{
    editText.value="Edit"
    activateEdition.value=false
  }
}

const onCloseSuccess = ()=>{
  ElMessage({
    message : "Suppression reussie" ,
    showClose : true ,
    type : "success"
  })
}
const onCloseError = (error : any)=>{
  Logger.error("Delete partner data error "+error)
  ElMessage({
    message : "error de fermetture de cette Agence" ,
    showClose : true ,
    type : "error"
  })
}

const onValidateSucess=()=>{
  ElMessage({
    message : "fermetture reussie" ,
    showClose : true ,
    type : "success"
  })
}


const handleAgencyDelete = (currAgency : agency)=>{
  ElMessageBox.confirm("Voulez vous vraiment fermer cette Agence ? " , "Confirmation de fermetture" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(async()=>{
      Loader.showLoader("Suppression des données")
      await AgencyService.deleteAgency(currAgency , onCloseSuccess , onCloseError)
      Loader.hideLoader()
  }).catch(()=>{})
}

onMounted(async()=>{
  supabase.channel("country_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'agency'} , async(payload)=>{
    console.log("LOG : Request Data from agency change " , payload)
    Loader.showLoader("Suppression des données")
    tableData.value = await AgencyService.getAgency()
    Loader.hideLoader()
  }).subscribe()
  Loader.showLoader("Suppression des données")
  tableData.value = await AgencyService.getAgency()
  Loader.hideLoader()
})


</script>
<!---@ts-nocheck--->
<template>
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826">
      Agences
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucune agence n'st trouvée">
      <el-table-column type="expand">
        <template #default="props">
          <agency-detail-form  :activate-edition="activateEdition" :agency="props.row" />
        </template>
      </el-table-column>
      <el-table-column prop="shortname">
        <template #default="props">
          <country-flag :image-name="props.row.agency_country?.shortname.toLowerCase()"/>
        </template>
      </el-table-column>
      <el-table-column label="Nom de l'agence" prop="agency_name" />
      <el-table-column label="telephone de l'agence" prop="agency_phone" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" type="danger" @click="handleAgencyDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(agency_action.delete))">Fermer</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row justify="center" style="height: 100px">
      <el-pagination background layout="prev, pager, next" :total="tableData?.length/10" />
    </el-row>
  </el-space>
</template>

<style scoped>
.el-text{
  font-family: "Arial Black";
}


.el-table{
  background-color: #ffffff;
}

.el-space{
  width: 100%;
  padding-left: 10px;
  background-color: #ffffff;
}

</style>
