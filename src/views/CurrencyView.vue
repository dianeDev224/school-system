<script setup lang="ts">
// @ts-nocheck

import NewCurrencyForm from "@/components/newForms/new-currency-form.vue";
import CurrencyTable from "@/components/tables/currency-table.vue";
import {app_action, user_profile} from "@/types/database-types.ts";
import {inject} from "vue";
import {currency_action} from "@/types/database-meta-data.ts";

const userActions = inject<user_profile>("user_actions") ;
</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-currency-form v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(currency_action.create))"/>
      <currency-table/>
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