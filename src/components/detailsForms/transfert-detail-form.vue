
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {FormInstance} from 'element-plus'
import {transfert_livraison_type_list} from "@/types/database-meta-data.ts";
import {country, partner, transfert} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {AgencyRules} from "@/components/formsRules/agencyRules.ts";
import {TransfertService} from "@/components/api/transfert.service.ts";
import {formatDate} from "@/components/utils/formatter.utils.ts";
import {CountryService} from "@/components/api/country.service.ts";
import {Loader} from "@/components/utils/AppLoader.ts";
import {PartnerService} from "@/components/api/partner.service.ts";

const formSize = ref('default')
const formRef = ref<FormInstance>()
const countryData = ref<country[]>()
const partenaireData = ref<partner[]>()

const props = defineProps<{transfert:transfert , title:string , isEditable:boolean,   activateEdition:boolean}>()
const detailTransfertForm = reactive<transfert>({
  transfert_base_agency:props.transfert?.transfert_base_agency,
  transfert_base_agency_id:props.transfert.transfert_base_agency_id,
  transfert_target_agency:props.transfert.transfert_target_agency,
  transfert_target_agency_id:props.transfert.transfert_target_agency_id,
  transfert_partner:props.transfert.transfert_partner,
  transfert_partner_id:props.transfert?.transfert_partner_id,
  transfert_livraisontype:props.transfert.transfert_livraisontype,
  transfert_mal:props.transfert.transfert_mal,
  transfert_type:props.transfert.transfert_type,
  transfert_alsaba_fees:props.transfert.transfert_alsaba_fees,
  transfert_alsaba_fees_id:props.transfert.transfert_alsaba_fees_id ,
  transfert_target_country:props.transfert.transfert_target_country,
  transfert_target_country_id:props.transfert.transfert_target_country_id,
  transfert_target_town:props.transfert.transfert_target_town,
  transfert_target_town_id:props.transfert.transfert_target_town_id,
  transfert_expeditaire_firstname:props.transfert.transfert_expeditaire_firstname,
  transfert_expeditaire_lastname:props.transfert.transfert_expeditaire_lastname,
  transfert_expeditaire_phone_number:props.transfert.transfert_expeditaire_phone_number?.slice(4),
  transfert_destinataire_firstname:props.transfert.transfert_expeditaire_firstname,
  transfert_destinataire_lastname:props.transfert.transfert_destinataire_lastname,
  transfert_destinataire_phone_number:props.transfert.transfert_destinataire_phone_number?.slice(4),
  transfert_caveaux:props.transfert.transfert_caveaux,
  transfert_caveaux_id:props.transfert.transfert_caveaux_id,
  transfert_partner_fees:props.transfert.transfert_partner_fees,
  transfert_partner_fees_id:props.transfert.transfert_partner_fees_id,
  canceled_at:props.transfert.canceled_at,
  validated_at:props.transfert.validated_at,
  transfert_code:TransfertService.getTansfertCode(props.transfert),
  date:formatDate(props.transfert.date)
})

const submitForm = async()=>{
  Loader.showLoader("MISE A JOUR DE TRANSFERT")
  console.log("for data : " , detailTransfertForm)
  await TransfertService.newTransfert(detailTransfertForm)
  setTimeout(()=>Loader.hideLoader(), 600)
  dialogVisible.value = false
}

onMounted(async()=>{
  countryData.value = await CountryService.getCountries()
  partenaireData.value = await PartnerService.getPartner();
})

</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse>
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Details
        </el-text>
      </template>
      <el-form
          ref="formRef"
          style="max-width: 600px"
          :model="detailTransfertForm"
          :rules="AgencyRules(detailTransfertForm)"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item disabled="true" label="date d'emission" prop="date">
          <el-input v-model="detailTransfertForm.date" />
        </el-form-item>
        <el-form-item label="prenom de l'expéditaire" prop="transfert_expeditaire_firstname">
          <el-input v-model="detailTransfertForm.transfert_expeditaire_firstname" />
        </el-form-item>
        <el-form-item label="nom de l'expeditaire" prop="transfert_expeditaire_lastname">
          <el-input v-model="detailTransfertForm.transfert_expeditaire_lastname" />
        </el-form-item>
        <el-form-item label="telephone de l'expeditaire" prop="transfert_expeditaire_phone_number">
          <el-input v-model="detailTransfertForm.transfert_expeditaire_phone_number" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="detailTransfertForm?.transfert_base_agency?.agency_country?.shortname?.toLowerCase() || ''"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{detailTransfertForm?.transfert_base_agency?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="prenom du destinataire" prop="transfert_destinataire_firstname">
          <el-input v-model="detailTransfertForm.transfert_destinataire_firstname" />
        </el-form-item>
        <el-form-item label="nom du destinataire" prop="transfert_destinataire_lastname">
          <el-input v-model="detailTransfertForm.transfert_destinataire_lastname" />
        </el-form-item>
        <el-form-item label="telephone du destinataire" prop="transfert_destinataire_phone_number">
          <el-input v-model="detailTransfertForm.transfert_destinataire_phone_number" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="detailTransfertForm?.transfert_base_agency?.agency_country?.shortname?.toLowerCase() || ''"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{detailTransfertForm?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="le mode  de livraison" prop="transfert_livraisontype">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune donnée trouvé" placeholder="le mode de livraison" v-model="detailTransfertForm.transfert_livraisontype">
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
        <el-form-item label="pays de base" prop="agency_country_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le pays de base" v-model="detailTransfertForm.transfert_base_agency">
            <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.country_name"
                :value="item.id"
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
        <el-form-item label="agence de base" prop="transfert_base_agency_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="l'agence de base" v-model="detailTransfertForm.transfert_base_agency_id">
            <el-option
                v-for="item in [detailTransfertForm.transfert_base_agency]"
                :key="item?.id"
                :label="item?.agency_name"
                :value="item?.id"
            >
              <el-space>
                <el-text size="small">
                  {{item.agency_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="pays de destination" prop="transfert_target_country">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="pays de destination" v-model="detailTransfertForm.transfert_target_country_id">
            <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.country_name"
                :value="item.id"
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
        <el-form-item label="agence de destination" prop="transfert_target_agency_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="agence de destination" v-model="detailTransfertForm.transfert_target_agency_id">
            <el-option
                v-for="item in [detailTransfertForm.transfert_target_agency]"
                :key="item?.id"
                :label="item?.agency_name"
                :value="item?.id"
            >
              <el-space>
                <el-text size="small">
                  {{item?.agency_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="patenaire alsaba" prop="transfert_partner_id">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune donné trouvée" placeholder="partnaire alsaba" v-model="detailTransfertForm.transfert_partner_id">
            <el-option
                v-for="item in partenaireData"
                :key="item?.id"
                :label="item?.partner_name"
                :value="item?.id"
            >
              <el-space>
                <el-text size="small">
                  {{item.partner_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'montant à livré(mal)'" prop="transfert_mal">
          <el-input v-model="detailTransfertForm.transfert_mal" />
        </el-form-item>
        <el-form-item :label="'frais à alsaba(mal)'" disabled="true" prop="props.transfert?.transfert_alsaba_fees">
          <el-text>
            {{TransfertService.getFeesFromCode(props.transfert?.transfert_alsaba_fees , props.transfert.transfert_mal)}}
          </el-text>
        </el-form-item>
        <el-form-item :label="'frais à partenaire(mal)'" disabled="true" prop="props.transfert?.transfert_alsaba_fees">
          <el-text>
            {{TransfertService.getFeesFromCode(props.transfert?.transfert_partner_fees , props.transfert.transfert_mal)}}
          </el-text>
        </el-form-item>
        <el-form-item label="date de validation" prop="validated_at">
          <el-text>{{formatDate(detailTransfertForm.validated_at)}}</el-text>
        </el-form-item>
        <el-form-item label="date d'annulation" prop="canceled_at">
          <el-text>{{formatDate(detailTransfertForm.canceled_at)}}</el-text>
        </el-form-item>
        <el-form-item v-if="props.isEditable">
          <el-button type="primary" style="--el-color-primary: #026826 ; --el-button-disabled-bg-color: #0fa243 ; --el-button-disabled-border-color: #0fa243  " @click="submitForm(formRef)" :disabled="!props.activateEdition">
            valider
          </el-button>
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

.el-text{
  font-family: "Arial Black";
}
</style>