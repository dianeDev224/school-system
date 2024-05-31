<script setup lang="ts">
// @ts-nocheck
import {ref , reactive} from "vue";
import {ElLoading, ElNotification, FormInstance, FormRules} from 'element-plus'
import supabase from "@/data-source.ts";
import {CountryRequestMapper} from "@/components/api/mappers/CountryRequestMapper.ts";
import {GlobalErrorHandler} from "@/components/api/globalErrorHandler.ts";
import MonthResultTable from "@/components/tables/month-result-table.vue";
import MonthBilanTable from "@/components/tables/month-bilan-table.vue";
import NbreTransactionTable from "@/components/tables/nbre-transaction-table.vue";

const selectedDate = ref('')


</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Historique des performances
        </el-text>
      </template>
      <el-space direction="vertical" fill="fill" style="width: 100%">
        <el-row justify="start">
          <el-date-picker
              v-model="selectedDate"
              type="monthrange"
              unlink-panels
              range-separator="To"
              start-placeholder="mois de depart"
              end-placeholder="mois de fin"
              onchange="console.log('date : ' , selectedDate)"
          />
        </el-row>
        <nbre-transaction-table/>
        <month-bilan-table/>
        <month-result-table/>
      </el-space>
    </el-collapse-item>

  </el-collapse>
</template>

<style scoped>
.el-collapse{
  background-color: #ffffff;
  padding-inline: 5px;
}

.el-text{
  font-family: "Arial Black";
}
</style>