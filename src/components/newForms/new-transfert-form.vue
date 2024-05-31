
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted, onUpdated, watch} from "vue";
import {FormInstance} from 'element-plus'
import CountryFlag from "@/components/icons/country-flag.vue";
import {caveaux, country, partner, transfert, user_profile} from "@/types/database-types.ts";
import {TransfertRules} from "@/components/formsRules/transfertRules.ts";
import {transfert_livraison_type_list, transfert_type_list} from "@/types/database-meta-data.ts";
import {CountryService} from "@/components/api/country.service.ts";
import {Loader} from "@/components/utils/AppLoader.ts";
import {AgencyService} from "@/components/api/agency.service.ts";
import {PartnerService} from "@/components/api/partner.service.ts";
import NewTransfertConfirmRecapPopup from "@/components/new-transfert-confirm-recap-popup.vue";
import {Alsaba_feesService} from "@/components/api/alsaba_fees.service.ts";
import {Partner_feesService} from "@/components/api/partner_fees.service.ts";
import {TransfertService} from "@/components/api/transfert.service.ts";
import {CaveauxService} from "@/components/api/caveaux.service.ts";

const activeNames = ref(['1'])
const props = defineProps<{partner_id : number}>()
const formSize = ref('default')
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const newTransfertForm = reactive<transfert>({})
const countryData = ref<country[]>([])
const currentAgency = ref<user_profile>([])
const caveauxData = ref<caveaux>([])
const alsaPartner = ref<partner[]>([])

const validateForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      dialogVisible.value = true
    } else {
      console.log('error submit!', fields)
    }
  })
}

const submitForm = async()=>{
  Loader.showLoader("NOUVEAU TRANSFERT")
  console.log("for data : " , newTransfertForm)
  newTransfertForm.transfert_code = TransfertService.getTansfertCode(newTransfertForm)
  await TransfertService.newTransfert(newTransfertForm)
  setTimeout(()=>Loader.hideLoader(), 600)
  dialogVisible.value = false
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


watch(()=>newTransfertForm.transfert_target_country_id , (val)=>{
  newTransfertForm.transfert_target_country = countryData.value.find((country)=>country.id == val)
})

watch(()=>newTransfertForm.transfert_target_town_id , (val)=>{
  newTransfertForm.transfert_target_town = newTransfertForm.transfert_target_country?.town.find((town)=>town.id == val)
})

watch(()=>newTransfertForm.transfert_partner_id && newTransfertForm.transfert_mal , async()=>{
  newTransfertForm.transfert_partner = alsaPartner.value?.find((partner)=>partner.id == newTransfertForm?.transfert_partner_id)
  newTransfertForm.transfert_partner_fees = await  Partner_feesService.getPartener_fees_by_country_interval(newTransfertForm.transfert_base_agency?.agency_country , newTransfertForm.transfert_target_country , newTransfertForm.transfert_mal , newTransfertForm.transfert_partner)
})

watch(()=>newTransfertForm.transfert_target_country && newTransfertForm.transfert_mal , async ()=>{
  newTransfertForm.transfert_alsaba_fees = await Alsaba_feesService.getAlsaba_fees_by_country_interval(newTransfertForm.transfert_base_agency?.agency_country , newTransfertForm.transfert_target_country , newTransfertForm.transfert_mal)
})

onMounted(async()=>{
  countryData.value = await CountryService.getCountries()
  currentAgency.value = await AgencyService.getCurrentAgency()
  alsaPartner.value = await PartnerService.getPartner()
  caveauxData.value = await CaveauxService.getCurrentUSerCaveaux(currentAgency.value)
  newTransfertForm.transfert_target_country = countryData.value[0]
  newTransfertForm.transfert_base_agency = currentAgency.value.agency
  console.log("country data : " , alsaPartner.value)
})

</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511; font-family: 'Arial Black';">
          Nouveau Transfert
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="newTransfertForm"
          :rules="TransfertRules(newTransfertForm)"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
      >
        <el-form-item label="type de transfert" prop="transfert_type">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune donnée trouvé" placeholder="le niveau d'agence" v-model="newTransfertForm.transfert_type">
            <el-option
                v-for="item in transfert_type_list"
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
        <el-form-item label="mode de livraison" prop="transfert_livraisontype">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune donnée trouvé" placeholder="le mode de livraison" v-model="newTransfertForm.transfert_livraisontype">
            <el-option
                v-for="item in transfert_livraison_type_list"
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
        <el-form-item v-if="newTransfertForm.transfert_type == transfert_type_list[1].code" label="pays de destination" prop="transfert_target_country">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé"  placeholder="pays de destination" v-model="newTransfertForm.transfert_target_country_id">
            <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.country_name"
                :value="item.id"
            >
              <el-space>
                <country-flag :image-name="item.shortname?.toLowerCase()"/>
                <el-text size="small">
                  {{item?.country_name?.toUpperCase()}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ville de destination" prop="transfert_target_town">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune donnée trouvé" placeholder="la ville de destination" v-model="newTransfertForm.transfert_target_town_id">
            <el-option
                v-for="item in newTransfertForm.transfert_target_country?.town"
                :key="item.id"
                :label="item.town_name"
                :value="item.id"
            >
              <el-space>
                <el-text size="small">
                  {{item?.town_name?.toUpperCase()}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="nom de l'expediteur" prop="transfert_expeditaire_firstname">
          <el-input v-model="newTransfertForm.transfert_expeditaire_firstname" type="text" />
        </el-form-item>
        <el-form-item label="prenom de l'expediteur" prop="transfert_expeditaire_lastname">
          <el-input v-model="newTransfertForm.transfert_expeditaire_lastname" type="text" />
        </el-form-item>
        <el-form-item label="telephone de l'expeditaire" prop="transfert_expeditaire_phone_number">
          <el-input type="number" v-model="newTransfertForm.transfert_expeditaire_phone_number" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="currentAgency?.agency?.agency_country?.shortname?.toLowerCase()"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{currentAgency?.agency?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="nom du destinataire" prop="transfert_destinataire_firstname">
          <el-input v-model="newTransfertForm.transfert_destinataire_firstname" type="text" />
        </el-form-item>
        <el-form-item label="prenom du destinataire" prop="transfert_destinataire_lastname">
          <el-input v-model="newTransfertForm.transfert_destinataire_lastname" type="text" />
        </el-form-item>
        <el-form-item label="telephone du destinataire" prop="transfert_destinataire_phone_number">
          <el-input type="number" v-model="newTransfertForm.transfert_destinataire_phone_number" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="newTransfertForm?.transfert_target_country?.shortname?.toLowerCase()"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{newTransfertForm?.transfert_target_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="'le montant à livrer ('+currentAgency.agency?.agency_country?.currency+')'" prop="transfert_livraisontype">
          <el-input  v-model="newTransfertForm.transfert_mal" type="number" />
        </el-form-item>
        <el-form-item  label="caveaux de  destination" prop="transfert_caveaux_id">
          <el-select no-match-text="aucune correspondance trouvée" no-data-text="aucune donnée trouvée" placeholder="caveaux de destination" v-model="newTransfertForm.transfert_caveaux_id">
            <el-option
                v-for="item in caveauxData"
                :key="item.id"
                :label="item.caveaux_name"
                :value="item.id"
            >
              <el-space>
                <el-text size="small">
                  {{item?.caveaux_name?.toUpperCase()}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="newTransfertForm.transfert_livraisontype == transfert_livraison_type_list[1].code" label="partenaire alsaba" prop="transfert_partenaire">
          <el-select no-match-text="aucune correspondance trouvée" no-data-text="aucune donnée trouvée" placeholder="partenaire alsaba" v-model="newTransfertForm.transfert_partner_id">
            <el-option
                v-for="item in alsaPartner"
                :key="item.id"
                :label="item.partner_name"
                :value="item.id"
            >
              <el-space>
                <el-text size="small">
                  {{item?.partner_name?.toUpperCase()}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-dialog
              v-model="dialogVisible"
              title="Récaputilatifs"
              width="600"
          >
            <new-transfert-confirm-recap-popup  :form-data="newTransfertForm"/>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogVisible = false">Annnuler</el-button>
                <el-button type="primary" @click=" submitForm()">
                  Valider
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="--el-color-primary: #026826"  @click="validateForm(ruleFormRef)">
            continuer
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">annuler</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.el-collapse{
  background-color: #ffffff;
  padding-left: 10px;
}
</style>