<script setup lang="ts">
import NewRoleManagementForm from "@/components/newForms/new-role-management-form.vue";
import RoleManagementTable from "@/components/tables/role-management-table.vue";
import {app_action, user_profile} from "@/types/database-types.ts";
import {inject} from "vue";
import {role_action} from "@/types/database-meta-data.ts";

const userActions = inject<user_profile>("user_actions") ;
</script>

<template>
  <el-scrollbar height="100%" >
    <el-space direction="vertical" fill="fill">
      <new-role-management-form v-if="userActions?.app_role?.app_action?.some((action:app_action)=>action.code.includes(role_action.create))"/>
      <role-management-table/>
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