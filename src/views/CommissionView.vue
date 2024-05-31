<script setup lang="ts">
// @ts-nocheck

import NewCommissionForm from "@/components/newForms/new-commission-form.vue";
import CommissionTable from "@/components/tables/commission-table.vue";
import {user_profile} from "@/types/database-types.ts";
import {inject} from "vue";
import {commission_action} from "@/types/database-meta-data.ts";

const userActions = inject<user_profile>("user_actions") ;
</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-commission-form />
      <commission-table/>
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