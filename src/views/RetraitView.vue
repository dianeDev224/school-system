<script lang="ts" setup>
// @ts-nocheck
import {inject} from "vue";
import {user_profile} from "@/types/database-types.ts";
import NewRetraitForm from "@/components/newForms/new-retrait-form.vue";
import AgencyRetraitEffectuer from "@/components/agency-retrait-effectuer.vue";

const userActions = inject<user_profile>("user_actions") ;

</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-retrait-form partner_id=""/>
      <agency-retrait-effectuer/>
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

