
<script setup lang="ts">
// @ts-nocheck

import CountryFlag from "@/components/icons/country-flag.vue";
import supabase from "@/data-source.ts";
import {onMounted, ref} from "vue";
import {country} from "@/types/database-types.ts";

const countryData = ref([])
const countryCode = ref<country>()
const emit = defineEmits<{():country}>()
const getCountry = async ()=>{
  let { data, error } = await supabase
      .from('country')
      .select(`*`)
  if (error) console.error(error)
  else {
    countryData.value = data as country[]
  }
}

onMounted(async()=>{
  await getCountry()
})
</script>

<template>
  <!---@ts-nocheck--->
  <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé"  style="width: 51px"   v-model="countryCode">
    <el-option
        v-for="item in countryData"
        :key="item.id"
        :label="item.country_name"
        :value="item"
    >
      <el-space>
        <country-flag :image-name="item?.shortname.toLowerCase()"/>
        <el-text size="small">
          {{item?.country_name.toUpperCase()}}
        </el-text>
      </el-space>
    </el-option>
    <template v-if="countryCode" #prefix>
      <el-space>
        <country-flag :image-name="countryCode.shortname.toLowerCase()"/>
      </el-space>
    </template>
  </el-select>
</template>

<style scoped>

</style>