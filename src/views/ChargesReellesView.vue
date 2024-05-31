<script lang="ts" setup>
// @ts-nocheck
import {inject} from "vue";
import {user_profile} from "@/types/database-types.ts";
import NewDepotForm from "@/components/newForms/new-depot-form.vue";
import AgencyDepotEffectuer from "@/components/agency-depot-effectuer.vue";
import AgencyDepotAnnuler from "@/components/agency-depot-annuler.vue";
import NewChargesReellesForm from "@/components/newForms/new-charges-reelles-form.vue";
import ChargesReellesTable from "@/components/tables/charges-reelles-table.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-charges-reelles-form partner_id=""/>
      <charges-reelles-table/>
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

