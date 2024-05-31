<!---// @ts-nocheck--->
<script setup lang="ts">
  import {useRoute} from "vue-router";

  const route = useRoute()
</script>

<template>
  <el-row align="middle">
    <el-breadcrumb >
      <el-breadcrumb-item >
        <el-text size="large" style="font-family: 'Cambria Math' , sans-serif ; text-transform: capitalize">
          {{route.name}}
        </el-text>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>
</template>

<style scoped>
  .el-row{
    background-color: #f5f5f5;
    width: 100%;
    height: 30px;
  }
</style>