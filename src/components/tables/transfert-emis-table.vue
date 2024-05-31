
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import supabase from "@/data-source.ts";
import {app_action, currency, fees, transfert, user_profile} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import FeesDetailForm from "@/components/detailsForms/fees-detail-form.vue";
import {fees_action} from "@/types/database-meta-data.ts";
import {TransfertService} from "@/components/api/transfert.service.ts";
import {formatDate} from "@/components/utils/formatter.utils.ts";
import TransfertDetailForm from "@/components/detailsForms/transfert-detail-form.vue";


const parentBorder = ref(false)
const tableData = ref<transfert[]>([])
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
const Loader = ()=>{
  return ElLoading.service({
    lock:false ,
    text:"CHARGEMENT DES DONNEES" ,
    background:'rgba(0,0,0,0.7)'
  })
}

const getFeesData = async()=>{
  const loader = Loader()
  let { data, error } = await supabase
      .from('fees')
      .select(`* ,
            base_country:base_country_id(*),
            target_country:target_country_id(*)
      `)
  if (error) Logger.error("get currency data error " +error)
  else {
    tableData.value = data as currency[]
    loader.close()
  }
}

const deletFees = async(currentFees : fees)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("fees").delete().eq("id" , currentFees.id).select()
  if(error){
    Logger.error("Delete Fees data error "+error)
    ElMessage({
      message : "error de suppression de ce frais" ,
      showClose : true ,
      type : "error"
    })
  }else{
    Logger.info("Delete Fees data successfully "+data)
    ElMessage({
      message : "Frais supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}


const handleFeesDelete = (currenFees : fees)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce frais  ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletFees(currenFees)
  }).catch(()=>{})
}


onMounted(async()=>{
  tableData.value = await TransfertService.getTransfert()
  console.log("date: " , formatDate(tableData.value[0]?.date))
})


</script>
<!---@ts-nocheck--->
<template>
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826 ; font-family: 'Arial Black';">
      Tranferts Emis
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucun pays n'st trouvé">
      <el-table-column type="expand">
        <template #default="props">
          <transfert-detail-form title="Transfert Emis" :activate-edition="activate-edition" :is-editable="true" :transfert="props.row"/>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="Date">
        <template #default="props">
          <el-space>
            <el-text size="small">
              {{formatDate(props.row.date)}}
            </el-text>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column prop="base_country" label="pays de base">
        <template #default="props">
          <el-space>
            <country-flag :image-name="props.row.transfert_base_agency?.agency_country?.shortname?.toLowerCase()"/>
            <el-text size="small">
              {{props.row?.transfert_base_agency?.agency_country?.country_name?.toLocaleUpperCase()}}
            </el-text>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="Code de transfert" prop="transfert_code" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(fees_action.update))">{{editText}}</el-button>
          <el-button size="small" type="danger" @click="handleFeesDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(fees_action.delete))">Supprimer</el-button>
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
