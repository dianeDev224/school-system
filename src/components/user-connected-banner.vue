<!---// @ts-nocheck--->
<script setup lang="ts">

import {Icon} from "@iconify/vue";
</script>

<template>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-icon style="height: 20px ; width: 20px">
          <Icon style="height: 20px ; width: 20px" icon="mdi:account" />
        </el-icon>
      </el-col>
      <el-col :span="16">
        <el-space direction="vertical" size="small">
          <el-text>Sanassy Diane</el-text>
          <el-text size="small" style="--el-text-font-size: 11px">alsaba guinée</el-text>
        </el-space>
      </el-col>
    </el-row>
</template>

<style scoped>

</style>