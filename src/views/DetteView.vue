<script lang="ts" setup>
// @ts-nocheck
import {inject} from "vue";
import {user_profile} from "@/types/database-types.ts";
import AgencyDepotEffectuer from "@/components/agency-depot-effectuer.vue";
import AgencyDepotAnnuler from "@/components/agency-depot-annuler.vue";
import NewDettesForm from "@/components/newForms/new-dettes-form.vue";
import NewRemboursementDettesForm from "@/components/newForms/new-remboursement-dettes-form.vue";
import DettesListeTable from "@/components/tables/dettes-liste-table.vue";
import DettesRembourserTable from "@/components/tables/dettes-rembourser-table.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-dettes-form partner_id=""/>
      <dettes-liste-table/>
      <new-remboursement-dettes-form partner_id=""/>
      <dettes-rembourser-table/>
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

