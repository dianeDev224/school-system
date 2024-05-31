<script setup lang="ts">
// @ts-nocheck
import NewCaveauxForm from "@/components/newForms/new-caveaux-form.vue";
import CaveauxTable from "@/components/tables/caveaux-table.vue";
import {user_action, user_profile} from "@/types/database-types.ts";
import {inject} from "vue";
import {caveaux_action} from "@/types/database-meta-data.ts";

const userActions = inject<user_profile>("user_actions") ;
</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-caveaux-form v-if="userActions?.app_role?.app_action?.some((action)=>action.code.includes(caveaux_action.create))"/>
      <caveaux-table/>
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