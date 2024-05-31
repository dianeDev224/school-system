<script setup lang="ts">
  import url from '@/assets/alsaba_brand.jpg'
</script>

<template>
  <el-image  :src="url" :fit="'scale-down'" >
    <template #error>
        <el-icon style="width: 100% ; height: 100%"><i-ep-picture style="width: 100% ; height: 100% ; color: #adabab" /></el-icon>
    </template>
  </el-image>

</template>

<style scoped>
  .el-image{
    width: 100%;
    height: 100%;
  }
</style>