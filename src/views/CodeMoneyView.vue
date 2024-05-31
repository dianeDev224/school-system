<script lang="ts" setup>
// @ts-nocheck
import {inject} from "vue";
import {user_profile} from "@/types/database-types.ts";
import NewDepotForm from "@/components/newForms/new-depot-form.vue";
import AgencyDepotEffectuer from "@/components/agency-depot-effectuer.vue";
import AgencyDepotAnnuler from "@/components/agency-depot-annuler.vue";
import NewCodeMoneyForm from "@/components/newForms/new-code-money-form.vue";
import AgencyCodeMoneyEncaisser from "@/components/agency-code-money-encaisser.vue";
import AgencyCodeMoneyEmis from "@/components/agency-code-money-emis.vue";
import AgencyCodeMoneyAnnuler from "@/components/agency-code-money-annuler.vue";
import AgencyEncaisserCodeMoney from "@/components/agency-encaisser-code-money.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-code-money-form partner_id=""/>
      <agency-code-money-emis/>
      <agency-encaisser-code-money partner_id=""/>
      <agency-code-money-encaisser/>
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

