<script lang="ts" setup>
// @ts-nocheck
  import CountryTable from "@/components/tables/country-liste-table.vue";
  import NewCountryForm from "@/components/newForms/new-country-form.vue";
  import {country_action} from "@/types/database-meta-data.ts";
  import {app_action, user_action, user_profile} from "@/types/database-types.ts";
  import {inject} from "vue";

  const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
    <el-scrollbar height="100%" >
      <el-space direction="vertical" fill="fill">
        <new-country-form v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(country_action.create))"/>
        <country-table/>
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

