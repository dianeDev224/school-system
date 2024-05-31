<script setup lang="ts">
// @ts-nocheck
import NewFeesForm from "@/components/newForms/new-fees-form.vue";
import FeesTable from "@/components/tables/fees-table.vue";
import {app_action , user_profile} from "@/types/database-types.ts";
import {fees_action} from "@/types/database-meta-data.ts";
import {inject} from "vue";

const userActions = inject<user_profile>("user_actions") ;
</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-fees-form v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(fees_action.create))"/>
      <fees-table/>
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