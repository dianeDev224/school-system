<script lang="ts" setup>
// @ts-nocheck
import {inject} from "vue";
import {user_profile} from "@/types/database-types.ts";
import NewDepotForm from "@/components/newForms/new-depot-form.vue";
import AgencyDepotEffectuer from "@/components/agency-depot-effectuer.vue";
import AgencyDepotAnnuler from "@/components/agency-depot-annuler.vue";
import NewEmpruntForm from "@/components/newForms/new-emprunt-form.vue";
import EmpruntTable from "@/components/tables/emprunt-table.vue";
import EmpruntNonRembourserTable from "@/components/tables/emprunt-rembourser-table.vue";
import NewRemboursementEmpruntForm from "@/components/newForms/new-remboursement-emprunt-form.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-emprunt-form partner_id=""/>
      <emprunt-table/>
      <new-remboursement-emprunt-form partner_id=""/>
      <emprunt-non-rembourser-table/>
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

