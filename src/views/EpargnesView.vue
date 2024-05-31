<script lang="ts" setup>
// @ts-nocheck
import {inject} from "vue";
import {user_profile} from "@/types/database-types.ts";
import NewDepotForm from "@/components/newForms/new-depot-form.vue";
import AgencyDepotEffectuer from "@/components/agency-depot-effectuer.vue";
import AgencyDepotAnnuler from "@/components/agency-depot-annuler.vue";
import NewEpargnesForm from "@/components/newForms/new-epargnes-form.vue";
import NewInjectionEpargneForm from "@/components/newForms/new-injection-epargne-form.vue";
import EpargneListeTable from "@/components/tables/epargne-liste-table.vue";
import EpargneRembourserTable from "@/components/tables/epargne-rembourser-table.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-epargnes-form partner_id=""/>
      <epargne-liste-table/>
      <new-injection-epargne-form partner_id=""/>
      <epargne-rembourser-table/>
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

