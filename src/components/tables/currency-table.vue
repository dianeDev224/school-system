
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted , ref} from 'vue'
import supabase from "@/data-source.ts";
import {app_action, country, currency, user_profile} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import CurrencyDetailForm from "@/components/detailsForms/currency-detail-form.vue";
import {currency_action} from "@/types/database-meta-data.ts";


const parentBorder = ref(false)
const tableData = ref<currency[]>([])
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
const Loader = ()=>{
  return ElLoading.service({
    lock:false ,
    text:"CHARGEMENT DES DONNEES" ,
    background:'rgba(0,0,0,0.7)'
  })
}

const getCurrencyData = async()=>{
  const loader = Loader()
  let { data, error } = await supabase
      .from('currency')
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

const deletCurrency = async(currentCurrecny : currency)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("currency").delete().eq("id" , currentCurrecny.id).select()
  if(error){
    Logger.error("Delete currency data error ")
    ElMessage({
      message : "error de suppression de ce taux" ,
      showClose : true ,
      type : "error"
    })
  }else{
    Logger.info("Delete country data successfully ")
    ElMessage({
      message : "Taux d'échange supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}


const handleCurrencyDelete = (currenCountry : country)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce taux  ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletCurrency(currenCountry)
  }).catch(()=>{})
}


onMounted(async()=>{
  supabase.channel("currency_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'currency'} , async(payload)=>{
    Logger.log("currency data changed "+payload)
    await getCurrencyData()
  }).subscribe()
  await getCurrencyData()
})


</script>
<template>
  <!---@ts-nocheck--->
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826 ; font-family: 'Arial Black';">
      Taux D'échange
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucun pays n'st trouvé">
      <el-table-column type="expand">
        <template #default="props">
          <currency-detail-form :activate-edition="activateEdition" :currency="props.row" />
        </template>
      </el-table-column>
      <el-table-column prop="base_country" label="pays d'origine">
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
      <el-table-column label="Taux d'echange" prop="currency" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(currency_action.update))">{{editText}}</el-button>
          <el-button size="small" type="danger" @click="handleCurrencyDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(currency_action.delete))">Delete</el-button>
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
