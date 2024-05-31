
<script lang="ts" setup>
// @ts-nocheck
import {inject, onMounted, ref} from 'vue'
import NewTownForm from "@/components/newForms/new-town-form.vue";
import supabase from "@/data-source.ts";
import {app_action, country, neighborhood, town, user_action, user_profile} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import CountryDetailForm from "@/components/detailsForms/country-detail-form.vue";
import TownDetailForm from "@/components/detailsForms/town-detail-form.vue";
import NeighborhoodDetailForm from "@/components/detailsForms/neighborhood-detail-form.vue";
import NewNeighborhoodForm from "@/components/newForms/new-neighborhood-form.vue";
import {
  country_action, neighborhood_action, town_action,
} from "@/types/database-meta-data.ts";


const parentBorder = ref(false)
const childBorder = ref(false)
const tableData = ref<country[]>([])
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

const getCountryData = async()=>{
  const loader = Loader()
  let { data, error } = await supabase
      .from('country')
      .select(`* ,
            town(* , neighborhood(*))
      `)
  if (error) console.error(error)
  else {
    tableData.value = data as country[]
    loader.close()
  }
}

const deletCountry = async(currentCountry : country)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("country").delete().eq("id" , currentCountry.id).select()
  if(error){
    console.log("LOG ERROR : Delete country data error " , error)
    ElMessage({
      message : "error de suppression de ce pays" ,
      showClose : true ,
      type : "error"
    })
  }else{
    console.log("LOG INFO : Delete country data " , data)
    ElMessage({
      message : "Pays supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}

const deleteTown = async(currentTown : town)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("town").delete().eq("id" , currentTown.id).select()
  if(error){
    console.log("LOG ERROR : Delete town data error " , error)
    ElMessage({
      message : "error de suppression de cette ville" ,
      showClose : true ,
      type : "error"
    })
  }else{
    console.log("LOG INFO : Delete town data " , data)
    ElMessage({
      message : "Ville supprimée avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}

const deleteNeighborhood = async(currentNeighborhood : neighborhood)=>{
  const loader = Loader()
  const {data , error} = await supabase.from("neighborhood").delete().eq("id" , currentNeighborhood.id).select()
  if(error){
    console.log("LOG ERROR : Delete neighborhood data error " , error)
    ElMessage({
      message : "error de suppression de ce quartier" ,
      showClose : true ,
      type : "error"
    })
  }else{
    console.log("LOG INFO : Delete neighborhood data " , data)
    ElMessage({
      message : "quartier supprimé avec success" ,
      showClose : true ,
      type : "success"
    })
  }
  setTimeout(()=>loader.close() , 500)
}

const handleCountryDelete = (currenCountry : country)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce pays ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deletCountry(currenCountry)
  }).catch(()=>{})
}

const handleTownDelete = (currentTown : town)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer cette ville ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deleteTown(currentTown)
  }).catch(()=>{})
}


const handleNeighborhoodDelete = (currentNeighborhood : neighborhood)=>{
  ElMessageBox.confirm("Voulez vous vraiment supprimer ce quartier ?" , "Confirmation de suppression" , {
    confirmButtonText : "Oui" ,
    cancelButtonText : "Non" ,
    type : "warning"
  }).then(()=>{
    deleteNeighborhood(currentNeighborhood)
  }).catch(()=>{})
}

onMounted(async()=>{
  supabase.channel("country_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'country'} , async(payload)=>{
    console.log("LOG : Request Data from country change " , payload)
    await getCountryData()
  }).subscribe()
  supabase.channel("town_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'town'} , async(payload)=>{
    console.log("LOG: Request Data from town change " , payload)
    await getCountryData()
  }).subscribe()
  supabase.channel("neighbordhood_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'neighborhood'} , async(payload)=>{
    console.log("LOG: Request Data from neighborhood change " , payload)
    await getCountryData()
  }).subscribe()
  await getCountryData()
})


</script>
<!---@ts-nocheck--->
<template>
  <el-space direction="vertical" fill="fill">
    <el-text size="large" style="color: #026826">
      Pays
    </el-text>
    <el-table :data="tableData" :border="parentBorder" style="width: 100%;"  empty-text="aucun pays n'st trouvé">
      <el-table-column type="expand">
        <template #default="props">
          <el-space direction="vertical" fill="fill">
            <country-detail-form :country="props.row" :activate-edition="activateEdition"/>
            <new-town-form :country_id="props.row.id" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(town_action.create))"/>
            <el-text size="large" style="color: #026826">
              Villes
            </el-text>
            <el-table :data="props.row.town" :border="childBorder" empty-text="aucune ville trouvée">
              <el-table-column type="expand">
                <template #default="props">
                  <el-space direction="vertical" fill="fill">
                    <town-detail-form :activate-edition="activateEdition" :town="props.row"/>
                    <el-text size="large" style="color: #026826">
                      Quartiers
                    </el-text>
                    <new-neighborhood-form :town_id="props.row.id"  v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(neighborhood_action.create))"/>
                    <el-table :data="props.row.neighborhood" :border="parentBorder" empty-text="aucun quartier trouvé">
                      <el-table-column type="expand">
                        <template #default="props">
                          <el-space direction="vertical" fill="fill">
                            <neighborhood-detail-form :activate-edition="activateEdition" :neighborhood="props.row"/>
                          </el-space>
                        </template>
                      </el-table-column>
                      <el-table-column label="Nom du quartier" prop="neighborhood_name" />
                      <el-table-column label="Operations">
                        <template #default="props">
                          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(neighborhood_action.update))">{{editText}}</el-button>
                          <el-button size="small" type="danger" @click="handleNeighborhoodDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(neighborhood_action.delete))">Delete</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-row justify="center">
                      <el-pagination background layout="prev, pager, next" :total="1" />
                    </el-row>
                  </el-space>
                </template>
              </el-table-column>
              <el-table-column label="Nom de la ville" prop="town_name" />
              <el-table-column label="Operations">
                <template #default="props">
                  <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(town_action.update))">{{editText}}</el-button>
                  <el-button size="small" type="danger" @click="handleTownDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(town_action.delete))">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row justify="center">
              <el-pagination background layout="prev, pager, next" :total="1" />
            </el-row>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column prop="shortname">
        <template #default="props">
          <country-flag :image-name="props.row.shortname.toLowerCase()"/>
        </template>
      </el-table-column>
      <el-table-column label="Nom" prop="country_name" />
      <el-table-column label="Capital" prop="capital" />
      <el-table-column label="Actions">
        <template #default="props">
          <el-button size="small" @click="toggleEditText" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(country_action.update))" >{{editText}}</el-button>
          <el-button size="small" type="danger" @click="handleCountryDelete(props.row)" v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(country_action.delete))">Supprimer</el-button>
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
