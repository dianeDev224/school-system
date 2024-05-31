<script setup lang="ts">
// @ts-nocheck

import Sidebar from "@/components/sidebar.vue";
import MainHeader from "@/components/main-header.vue";
import {onMounted, provide, ref} from "vue";
import {user_profile} from "@/types/database-types.ts";
import {Loader} from "@/components/utils/AppLoader.ts";
import supabase from "@/data-source.ts";
import {Logger} from "@/components/utils/Logger.ts";


const provider = ref<user_profile>()
provide("user_actions" , provider)


const getRoleAction = async()=>{
  Loader.showLoader("CHARGEMENT DES ACTIONS ET ROLES")
  const current_user = await supabase.auth.getUser()
  const user_id = await current_user.data.user?.id
  let { data , error } = await supabase
      .from("user_profile")
      .select(`
              *,
              app_role(*,
              app_action(*)
              )
      `)
      .eq('user_id', user_id)
      .limit(1)
  if (error) console.error(error)
  else {
    console.log("role data  comming from database : " , data)
    Logger.info("user profile  comming from database : "+data)
    provider.value = data[0] as user_profile
  }
  setTimeout(()=>Loader.hideLoader() , 500)
}


onMounted(async() => {
  supabase.channel("user_action_channel").on("postgres_changes" , {event:"*" , schema:'public' , table:'user_action_role'} , async(payload)=>{
    console.log("LOG : Request Data from user action role change " , payload)
    await getRoleAction()
  }).subscribe()
  await getRoleAction()
})
</script>

<template>
  <!---@ts-nocheck--->
  <el-container>
    <el-aside width="250px">
      <sidebar/>
    </el-aside>
    <el-main>
      <main-header/>
      <RouterView/>
    </el-main>
  </el-container>
</template>

<style scoped>
  .el-container{
    width: 100%;
    height: 100%;
    background-color: #eaeaea;
  }
  .el-main{
    overflow: hidden;
  }
</style>