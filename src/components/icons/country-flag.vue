<script setup lang="ts">
  const props = defineProps<{ imageName : String}>()
</script>

<template>
  <el-image  :src="'https://flagcdn.com/16x12/' + props.imageName + '.png'" :fit="'scale-down'" >
    <template #error>
      <el-icon style="width: 100% ; height: 100%"><i-ep-picture style="width: 100% ; height: 100% ; color: #adabab" /></el-icon>
    </template>
  </el-image>
</template>

<style scoped>

</style>