
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {ElNotification, FormInstance} from 'element-plus'
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import {agence_type_list, agency_level_list} from "@/types/database-meta-data.ts";
import {country, subscription, user_profile} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {Logger} from "@/components/utils/Logger.ts";
import {AgencyRules} from "@/components/formsRules/agencyRules.ts";
import {SubscriptionService} from "@/components/api/subscription.service.ts";
import {Loader} from "@/components/utils/AppLoader.ts";
import {CountryService} from "@/components/api/country.service.ts";
import {AgencyService} from "@/components/api/agency.service.ts";

const activeNames = ref(['1'])

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const countryData = ref<country[]>([])
const activateEdition = ref<boolean>(false)

const agencyData = ref<user_profile>()

const currentAgencyForm = reactive<subscription>({
  agency_shortname:'',
  agency_name:'',
  agency_phone:'',
  agency_type:'',
  agency_level:'' ,
  agency_owner_first_name:'',
  agency_owner_last_name:'',
  agency_owner_phone_number: '',
  agency_country:'',
  agency_town:'',
  agency_neighborhood:''
})


const onSucess = (formInstnace:FormInstance)=>{
  resetForm(formInstnace)
  ElNotification({
    title: 'Mise à jour de Demande',
    message: 'Demande mise à jour avec success',
    type: 'success',
  })
  Logger.info('Subscription Updated successfully '+requestData.data)
}

const onError = ()=>{
  ElNotification({
    title: 'Mise à jour de Demande',
    message: GlobalErrorHandler.process_error(requestData.status),
    type: 'error',
  })
  console.log("error  : " , requestData.error)
  Logger.error("error occured when updating subscription"+requestData.error)
}



const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      Loader.showLoader("MISE A JOUR DE LA DEMANDE")
      await SubscriptionService.updateSubscription(currentAgencyForm , ()=>onSucess(formEl) , onError)
      Loader.hideLoader()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


onMounted(async()=>{
  Loader.showLoader("CHARGEMENT DES DONNEES")
  countryData.value = await CountryService.getCountries()
  agencyData.value = await AgencyService.getCurrentAgency()
  console.log("agency data : " , agencyData.value)
  currentAgencyForm.id =   agencyData.value?.id;
  currentAgencyForm.agency_shortname  = agencyData.value?.agency?.agency_shortname;
  currentAgencyForm.agency_name = agencyData.value?.agency?.agency_name;
  currentAgencyForm.agency_phone = agencyData.value?.agency?.agency_phone?.slice(4);
  currentAgencyForm.agency_type = agencyData.value?.agency?.agency_type;
  currentAgencyForm.agency_level = agencyData.value?.agency?.agency_level ;
  currentAgencyForm.agency_owner_first_name = agencyData.value?.firstname;
  currentAgencyForm.agency_owner_last_name = agencyData.value?.lastname;
  currentAgencyForm.agency_owner_phone_number=   agencyData.value?.phone_number?.slice(4);
  currentAgencyForm.agency_country = agencyData.value?.agency?.agency_country;
  currentAgencyForm.agency_town = agencyData.value?.agency?.agency_town;
  currentAgencyForm.agency_neighborhood = agencyData.value?.agency?.agency_neighborhood;
  Loader.hideLoader()
})

</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-space spacer="|" size="large" >
          <el-text size="large" style="color: #F90511;">
            Details
          </el-text>
        </el-space>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="currentAgencyForm"
          :rules="AgencyRules(currentAgencyForm)"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!activateEdition"
      >
        <el-form-item label="nom de l'agence" prop="agency_name">
          <el-input v-model="currentAgencyForm.agency_name" />
        </el-form-item>
        <el-form-item label="dinmutif de l'agence" prop="agency_shortname">
          <el-input :disabled="true" v-model="currentAgencyForm.agency_shortname" />
        </el-form-item>
        <el-form-item label="le pays l'agence" prop="agency_country">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le pays l'agence" v-model="currentAgencyForm.agency_country">
            <el-option
                v-for="item in [currentAgencyForm?.agency_country]"
                :key="item.id"
                :label="item.country_name"
                :value="item"
            >
              <el-space>
                <country-flag :image-name="item.shortname?.toLowerCase()"/>
                <el-text size="small">
                  {{item.country_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="telephone de l'agence" prop="agency_phone">
          <el-input v-model="currentAgencyForm.agency_phone" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="currentAgencyForm?.agency_country?.shortname?.toLowerCase()"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{currentAgencyForm?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="le type d'agence" prop="agency_type">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le type d'agence" v-model="currentAgencyForm.agency_type">
            <el-option
                v-for="item in agence_type_list"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
              <el-space>
                <el-text size="small">
                  {{item.name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="le niveau d'agence" prop="agency_level">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le niveau d'agence" v-model="currentAgencyForm.agency_level">
            <el-option
                v-for="item in agency_level_list"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
              <el-space>
                <el-text size="small">
                  {{item.name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="prénom du propriétaire" prop="agency_owner_first_name">
          <el-input v-model="currentAgencyForm.agency_owner_first_name" />
        </el-form-item>
        <el-form-item label="nom du propriétaire" prop="agency_owner_last_name">
          <el-input v-model="currentAgencyForm.agency_owner_last_name" />
        </el-form-item>
        <el-form-item label="le téléphone du propriétaire" prop="agency_owner_phone_number">
          <el-input v-model="currentAgencyForm.agency_owner_phone_number" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="currentAgencyForm?.agency_country?.shortname?.toLowerCase()"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{currentAgencyForm?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="la ville l'agence" prop="agency_town">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune ville trouvée" placeholder="la ville de l'agence" v-model="currentAgencyForm.agency_town">
            <el-option
                v-for="item in [currentAgencyForm?.agency_town]"
                :key="item.id"
                :label="item.town_name"
                :value="item"
            >
              <el-space>
                <el-text size="small">
                  {{item.town_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="le quartier l'agence" prop="agency_neighborhood">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun quartier trouvé" placeholder="le quartier de l'agence" v-model="currentAgencyForm.agency_neighborhood">
            <el-option
                v-for="item in [currentAgencyForm?.agency_neighborhood]"
                :key="item.id"
                :label="item.neighborhood_name"
                :value="item"
            >
              <el-space>
                <el-text size="small">
                  {{item.neighborhood_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="--el-color-primary: #026826" @click="submitForm(ruleFormRef)">
            continuer
          </el-button>
        </el-form-item>
      </el-form>
      <el-button type="info" @click="activateEdition=!activateEdition">mise à jour</el-button>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.el-collapse{
  background-color: #ffffff;
  padding-left: 10px;
}

.el-text{
  font-family: "Arial Black";
}
</style>