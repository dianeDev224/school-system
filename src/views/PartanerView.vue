<script lang="ts" setup>
// @ts-nocheck
import NewPartnerForm from "@/components/newForms/new-partner-form.vue";
import PartnerTable from "@/components/tables/partner-table.vue";
import {inject} from "vue";
import {partner_action} from "@/types/database-meta-data.ts";
import {app_action , user_profile} from "@/types/database-types.ts";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-partner-form v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(partner_action.create))"/>
      <partner-table/>
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

