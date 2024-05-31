<script lang="ts" setup>
// @ts-nocheck
import {agency, user_profile} from "@/types/database-types.ts";
import {inject, onMounted, ref} from "vue";

import MyAgencyDetailForm from "@/components/detailsForms/my-agency-detail-form.vue";


const userActions = inject<user_profile>("user_actions") ;



</script>

<template>
  <!---@ts-nocheck--->
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <my-agency-detail-form />
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

