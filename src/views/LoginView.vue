<script setup lang="ts">
// @ts-nocheck
  import LoginForm from "@/components/login-form.vue";
  import LoginBrandImage from "@/components/icons/login-brand-image.vue";

</script>

<template>
  <!---@ts-nocheck--->
  <el-row>
    <el-col :span="12" >
      <login-brand-image/>
    </el-col>
    <el-col :span="12">
      <login-form/>
    </el-col>
  </el-row>
</template>

<style scoped>
  .el-row{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
</style>