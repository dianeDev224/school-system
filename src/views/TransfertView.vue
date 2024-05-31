<script lang="ts" setup>
// @ts-nocheck
import NewPartnerForm from "@/components/newForms/new-partner-form.vue";
import PartnerTable from "@/components/tables/partner-table.vue";
import {inject} from "vue";
import {partner_action} from "@/types/database-meta-data.ts";
import {app_action , user_profile} from "@/types/database-types.ts";
import NewTransfertForm from "@/components/newForms/new-transfert-form.vue";
import AgencyTransfertEnAttente from "@/components/agency-transfert-en-attente.vue";
import AgencyTransfertEmis from "@/components/agency-transfert-emis.vue";
import AgencyTransfertValider from "@/components/agency-transfert-valider.vue";
import AgencyTransfertAnnuler from "@/components/agency-transfert-annuler.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-transfert-form partner_id=""/>
      <agency-transfert-en-attente/>
      <agency-transfert-emis/>
      <agency-transfert-valider/>
      <agency-transfert-annuler/>
    </el-space>
  </el-scrollbar>
</template>

<style scoped>

.el-scrollbar{
  background-color: #f5f5f5;
}

.el-space{
  width: 100%;
}

</style>

