
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import supabase from "@/data-source.ts";
import {app_action, partner, partner_fees, user_profile} from "@/types/database-types.ts";
import {Logger} from "@/components/utils/Logger.ts";
import PartnerDetailForm from "@/components/detailsForms/partner-detail-form.vue";
import NewPartnerFeesForm from "@/components/newForms/new-partner-fees-form.vue";
import CountryFlag from "@/components/icons/country-flag.vue";
import PartnerFeesDetailForm from "@/components/detailsForms/partner-fees-detail-form.vue";
import {partner_action, partner_fees_action} from "@/types/database-meta-data.ts";


const parentBorder = ref(false)
const tableData = ref<partner[]>([])
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

const gePartnerData = async()=>{
  const loader = Loader()
  let { data, error } = await supabase
      .from('partner')
      .select(`* , partner_fees(* , base_country:base_country_id(*), target_country:target_country_id(*))`)
  if (error) console.error(error)
  else {
    tableData.value = data as partner[]
    loader.close()
  }
}

const deletPartner = async(currentPartner : partner)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("partner").delete().eq("id" , currentPartner.id).select()
  if(error){
    Logger.error("Delete partner data error "+error)
    ElMessage({
      message : "error de suppression de ce partenaire" ,
      showClose : true ,
      type : "error"
    })
  }else{
    Logger.info("Delete partner data successfull"+data)
    ElMessage({
      message : "Partenaire supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}

const deletePartnerFees = async(partnerFees : partner_fees)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("partner_fees").delete().eq("id" , partnerFees.id).select()
  if(error){
    Logger.error("Delete partner fees data error " , error)
    ElMessage({
      message : "error de suppression de ce frais partenaire" ,
      showClose : true ,
      type : "error"
    })
  }else{
    Logger.info("Delete partner fees data "+data)
    ElMessage({
      message : "frais partenaire supprimée avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}

const handlePartnerDelete = (currenPartner : partner)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce partenaire ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletPartner(currenPartner)
  }).catch(()=>{})
}

const handlePartnerFeesDelete = (currenPartnerFess : partner_fees)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce frais partenaire ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletePartnerFees(currenPartnerFess)
  }).catch(()=>{})
}


onMounted(async()=>{
  supabase.channel("partner_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'partner'} , async(payload)=>{
    Logger.log("Request Data from partner change "+payload)
    await gePartnerData()
  }).subscribe()
  supabase.channel("partner_fees_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'partner_fees'} , async(payload)=>{
    Logger.log("Request Data from partner fees change "+payload)
    await gePartnerData()
  }).subscribe()
  await gePartnerData()
})


</script>
<template>
  <!---@ts-nocheck--->
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826">
      Partenaires
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucun partenaire trouvé">
      <el-table-column type="expand">
        <template #default="props">
          <el-space direction="vertical" fill="fill">
              <partner-detail-form :partner="props.row" :activate-edition="activateEdition"/>
              <new-partner-fees-form :partner_id="props.row.id" />
            <el-text size="large" style="color: #026826">
              Frais du partenaire
            </el-text>
            <el-table :data="props.row?.partner_fees" :border="parentBorder" style="width: 100%;"  empty-text="aucun pays n'st trouvé">
              <el-table-column type="expand">
                <template #default="props">
                  <partner-fees-detail-form :activate-edition="activateEdition" :fees="props.row" />
                </template>
              </el-table-column>
              <el-table-column prop="base_country" label="pays de base">
                <template #default="props">
                  <el-space>
                    <country-flag :image-name="props.row.base_country?.shortname.toLowerCase()"/>
                    <el-text size="small">
                      {{props.row?.base_country?.country_name}}
                    </el-text>
                  </el-space>
                </template>
              </el-table-column>
              <el-table-column prop="target_country" label="pays de destination">
                <template #default="props">
                  <el-space>
                    <country-flag :image-name="props.row.target_country?.shortname.toLowerCase()"/>
                    <el-text size="small">
                      {{props.row?.target_country?.country_name}}
                    </el-text>
                  </el-space>
                </template>
              </el-table-column>
              <el-table-column :label="'Frais'" prop="fees" />
              <el-table-column label="Actions">
                <template #default="props">
                  <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(partner_fees_action.update))">{{editText}}</el-button>
                  <el-button size="small" type="danger" @click="handlePartnerFeesDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(partner_fees_action.delete))">Supprimer</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row justify="center">
              <el-pagination background layout="prev, pager, next" :total="1" />
            </el-row>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="Nom du partenaire" prop="partner_name" />
      <el-table-column label="Nom du abrégé" prop="shortname" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action)=>action.code.includes(partner_action.update))">{{editText}}</el-button>
          <el-button size="small" type="danger" @click="handlePartnerDelete(props.row)" v-if="code?.some((action)=>action.action_name.includes(partner_action.delete))">Delete</el-button>
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
