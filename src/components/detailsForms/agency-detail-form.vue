
<script setup lang="ts">
// @ts-nocheck
import {ref, reactive, onMounted} from "vue";
import {FormInstance} from 'element-plus'
import {agence_type_list, agency_level_list} from "@/types/database-meta-data.ts";
import {agency, country, subscription} from "@/types/database-types.ts";
import CountryFlag from "@/components/icons/country-flag.vue";
import {AgencyRules} from "@/components/formsRules/agencyRules.ts";

const activeNames = ref(['1'])

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const props = defineProps<{agency:agency ,   activateEdition:boolean}>()
const detailAgencyForm = reactive<subscription>({
  id: props.agency.id,
  agency_shortname:props.agency.agency_shortname,
  agency_name:props.agency.agency_name,
  agency_phone:props.agency.agency_phone?.slice(4),
  agency_type:props.agency.agency_type,
  agency_level:props.agency.agency_level ,
  agency_owner_first_name:props.agency.agency_owner?.firstname,
  agency_owner_last_name:props.agency.agency_owner?.lastname,
  agency_owner_phone_number: props.agency.agency_owner?.phone_number?.slice(4),
  agency_country:props.agency.agency_country,
  agency_town:props.agency.agency_town,
  agency_neighborhood:props.agency.agency_neighborhood,
})

</script>

<template>
  <!---@ts-nocheck--->
  <el-collapse v-model="activeNames" >
    <el-collapse-item name="1" >
      <template #title>
        <el-text size="large" style="color: #F90511;">
          Details
        </el-text>
      </template>
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="detailAgencyForm"
          :rules="AgencyRules(detailAgencyForm)"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          :disabled="!props.activateEdition"
      >
        <el-form-item label="nom de l'agence" prop="agency_name">
          <el-input v-model="detailAgencyForm.agency_name" />
        </el-form-item>
        <el-form-item label="dinmutif de l'agence" prop="agency_shortname">
          <el-input :disabled="true" v-model="detailAgencyForm.agency_shortname" />
        </el-form-item>
        <el-form-item label="le pays l'agence" prop="agency_country">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le pays l'agence" v-model="detailAgencyForm.agency_country">
            <el-option
                v-for="item in [detailAgencyForm.agency_country]"
                :key="item.id"
                :label="item.country_name"
                :value="item"
            >
              <el-space>
                <country-flag :image-name="item.shortname?.toLowerCase()"/>
                <el-text size="small">
                  {{item.country_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="telephone de l'agence" prop="agency_phone">
          <el-input v-model="detailAgencyForm.agency_phone" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="detailAgencyForm?.agency_country?.shortname?.toLowerCase()"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{detailAgencyForm?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="le type d'agence" prop="agency_type">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le type d'agence" v-model="detailAgencyForm.agency_type">
            <el-option
                v-for="item in agence_type_list"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
              <el-space>
                <el-text size="small">
                  {{item.name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="le niveau d'agence" prop="agency_level">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé" placeholder="le niveau d'agence" v-model="detailAgencyForm.agency_level">
            <el-option
                v-for="item in agency_level_list"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
              <el-space>
                <el-text size="small">
                  {{item.name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="prénom du propriétaire" prop="agency_owner_first_name">
          <el-input v-model="detailAgencyForm.agency_owner_first_name" />
        </el-form-item>
        <el-form-item label="nom du propriétaire" prop="agency_owner_last_name">
          <el-input v-model="detailAgencyForm.agency_owner_last_name" />
        </el-form-item>
        <el-form-item label="le téléphone du propriétaire" prop="agency_owner_phone_number">
          <el-input v-model="detailAgencyForm.agency_owner_phone_number" >
            <template #prepend>
              <el-icon>
                <el-space>
                  <country-flag :image-name="detailAgencyForm?.agency_country?.shortname?.toLowerCase() || ''"/>
                </el-space>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{detailAgencyForm?.agency_country?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="la ville l'agence" prop="agency_town">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucune ville trouvée" placeholder="la ville de l'agence" v-model="detailAgencyForm.agency_town">
            <el-option
                v-for="item in detailAgencyForm?.agency_town"
                :key="item?.id"
                :label="item?.town_name"
                :value="item"
            >
              <el-space>
                <el-text size="small">
                  {{item?.town_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="le quartier l'agence" prop="agency_neighborhood">
          <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun quartier trouvé" placeholder="le quartier de l'agence" v-model="detailAgencyForm.agency_neighborhood">
            <el-option
                v-for="item in detailAgencyForm?.agency_neighborhood"
                :key="item?.id"
                :label="item?.neighborhood_name"
                :value="item"
            >
              <el-space>
                <el-text size="small">
                  {{item?.neighborhood_name}}
                </el-text>
              </el-space>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.el-collapse{
  background-color: #ffffff;
  padding-left: 10px;
}

.el-text{
  font-family: "Arial Black";
}
</style>