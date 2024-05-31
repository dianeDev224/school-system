
<script setup lang="ts">

import {transfert} from "@/types/database-types.ts";
import {transfert_livraison_type_list} from "@/types/database-meta-data.ts";
import {TransfertService} from "./api/transfert.service.ts";

const props = defineProps<{formData: transfert}>()
console.log("fees data , ", props.formData)



</script>

<template>
  <el-scrollbar height="300" style="width: 100%">
    <el-space size="large" direction="vertical" fill="fill" style="width: 100%">
          <el-space>
            <el-card style="max-width: 480px">
              <template #header>
                <el-text type="info" size="large">
                  informations de l'expeditaire
                </el-text>
              </template>
              <el-space direction="vertical" fill="fill">
                <el-text>telephone : {{props.formData?.transfert_base_agency?.agency_country?.code + props.formData?.transfert_expeditaire_phone_number}}</el-text>
                <el-text>prenom : {{props.formData?.transfert_expeditaire_firstname}}</el-text>
                <el-text>nom : {{props.formData?.transfert_expeditaire_lastname}}</el-text>
                <el-text>pays : {{props.formData?.transfert_base_agency?.agency_country?.country_name}}</el-text>
                <el-text>ville : {{props.formData?.transfert_base_agency?.agency_town?.town_name}}</el-text>
              </el-space>
            </el-card>
            <el-card style="max-width: 480px">
              <template #header>
                <el-text type="info" size="large">
                  informations du destinataire
                </el-text>
              </template>
              <el-space direction="vertical" fill="fill">
                <el-text>telephone : {{props.formData?.transfert_target_country?.code+props.formData?.transfert_destinataire_phone_number}}</el-text>
                <el-text>prenom : {{props.formData?.transfert_destinataire_firstname}}</el-text>
                <el-text>nom : {{props.formData?.transfert_destinataire_lastname}}</el-text>
                <el-text>pays : {{props.formData?.transfert_target_country?.country_name}}</el-text>
                <el-text>ville : {{props.formData?.transfert_target_town?.town_name}}</el-text>
              </el-space>
            </el-card>
          </el-space>
    </el-space>
    <el-space size="large" direction="vertical" fill="fill" style="width: 100%">
      <el-space>
        <el-card style="max-width: 480px">
          <template #header>
            <el-text type="info" size="large">
              informations sur le transfert
            </el-text>
          </template>
          <el-space direction="vertical" fill="fill">
            <el-text>frais total ({{props.formData?.transfert_base_agency?.agency_country?.currency}}) : {{TransfertService.getFeesFromCode(props.formData.transfert_alsaba_fees , props.formData.transfert_mal)+TransfertService.getFeesFromCode(props.formData.transfert_partner_fees , props.formData.transfert_mal)}}</el-text>
            <el-text>frais alsaba ({{props.formData?.transfert_base_agency?.agency_country?.currency}}) : {{TransfertService.getFeesFromCode(props.formData.transfert_alsaba_fees , props.formData.transfert_mal)}}</el-text>
            <el-text>code du transfert : {{TransfertService.getTansfertCode(props.formData)}}</el-text>
          </el-space>
        </el-card>
        <el-card v-if="props.formData?.transfert_livraisontype === transfert_livraison_type_list[1].code" style="max-width: 480px">
          <template #header>
            <el-text type="info" size="large">
              informations du  partnaire alsaba
            </el-text>
          </template>
          <el-space direction="vertical" fill="fill">
            <el-text>partenaire : {{props.formData?.transfert_partner.partner_name}}</el-text>
            <el-text>frais ({{props.formData?.transfert_base_agency?.agency_country?.currency}}) : {{TransfertService.getFeesFromCode(props.formData.transfert_partner_fees , props.formData.transfert_mal)}}</el-text>
          </el-space>
        </el-card>
      </el-space>
    </el-space>
  </el-scrollbar>
</template>

