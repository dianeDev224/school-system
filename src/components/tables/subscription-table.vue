
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import supabase from "@/data-source.ts";
import {
  app_action,
  country, subscription,
  user_profile
} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {subscription_action} from "@/types/database-meta-data.ts";
import SubscriptionDetailForm from "@/components/detailsForms/subscription-detail-form.vue";
import {SubscriptionService} from "@/components/api/subscription.service.ts";
import {Loader} from "@/components/utils/AppLoader.ts";
import {Logger} from "@/components/utils/Logger.ts";


const parentBorder = ref(false)
const tableData = ref<subscription[]>([])
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

const onDeleteSuccess = ()=>{
  ElMessage({
    message : "Suppression reussie" ,
    showClose : true ,
    type : "success"
  })
}
const onDeleteError = (error : any)=>{
  Logger.error("Delete partner data error "+error)
  ElMessage({
    message : "error de suppression de cette demande" ,
    showClose : true ,
    type : "error"
  })
}

const onValidateSucess=()=>{
  ElMessage({
    message : "Validation reussie" ,
    showClose : true ,
    type : "success"
  })
}

const onValidateError = (error : any)=>{
  Logger.error("Validation error "+error)
  ElMessage({
    message : "error de validation de cette demande" ,
    showClose : true ,
    type : "error"
  })
}



const handleSubscriptionDelete = (currenCountry : country)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer cette Demande ? " , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    Loader.showLoader("Suppression des données")
    SubscriptionService.deleteSubscription(currenCountry ,  onDeleteSuccess , onDeleteError)
    Loader.hideLoader()
  }).catch(()=>{})
}

const handleSubscriptionValidate = (currSubscription : subscription)=>{
  ElMessageBox.confirm("Voulez vous vraiment valider cette Demande ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(async ()=>{
    Loader.showLoader("Suppression des données")
    await SubscriptionService.validateSubscription(currSubscription)
    Loader.hideLoader()
  }).catch(()=>{})
}

onMounted(async()=>{
  supabase.channel("country_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'subscription'} , async(payload)=>{
    console.log("LOG : Request Data from country change " , payload)
    Loader.showLoader("Suppression des données")
    tableData.value = await SubscriptionService.getSubscription()
    Loader.hideLoader()
  }).subscribe()
  Loader.showLoader("Suppression des données")
  tableData.value = await SubscriptionService.getSubscription()
  Loader.hideLoader()
})


</script>
<!---@ts-nocheck--->
<template>
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826">
      Demandes
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucune demande n'st trouvée">
      <el-table-column type="expand">
        <template #default="props">
          <subscription-detail-form  :activate-edition="activateEdition" :subscription="props.row" />
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
          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(subscription_action.update))" >{{editText}}</el-button>
          <el-button size="small" type="success" @click="handleSubscriptionValidate(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(subscription_action.delete))">valider</el-button>
          <el-button size="small" type="danger" @click="handleSubscriptionDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(subscription_action.delete))">Supprimer</el-button>
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
