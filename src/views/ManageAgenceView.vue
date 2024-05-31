<script lang="ts" setup>
// @ts-nocheck
import {subscription_action} from "@/types/database-meta-data.ts";
import {app_action , user_profile} from "@/types/database-types.ts";
import {inject} from "vue";
import NewSubscriptionForm from "@/components/newForms/new-subscription-form.vue";
import SubscriptionTable from "@/components/tables/subscription-table.vue";
import AgencyTable from "@/components/tables/agency-table.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <agency-table/>
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

