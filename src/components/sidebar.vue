<script setup lang="ts">
// @ts-nocheck
import DashboardIcon from "@/components/icons/dashbord-icon.vue";
import { Icon } from '@iconify/vue';
import UserConnectedBanner from "@/components/user-connected-banner.vue";
import {
  agence_user_action,
  agency_action, auto_inections_action,
  caveaux_action, caveaux_line_action, charges_fictives_action, charges_relles_action, codes_money_action,
  country_action,
  currency_action, depots_action, dettes_action, emprunts_action, epargnes_action,
  fees_action, injections_action,
  partner_action, partner_fees_action, retraits_action, role_action, subscription_action, transferts_action
} from "@/types/database-meta-data.ts";
import {inject, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {AppItems} from "@/components/utils/AppItems.ts";
import {app_action, user_profile} from "@/types/database-types.ts";

type dashbord_itm_type = {
  index : string
  name:string
  icon : string
  show : boolean
  route : {path : string}
}



const userActions = inject<user_profile>("user_actions") ;
const router = useRouter()
const OperationItem = ref<dashbord_itm_type[]>([])
const CaisseItem = ref<dashbord_itm_type[]>([])
const ParameterItem = ref<dashbord_itm_type[]>([])
const AgencyItem = ref<dashbord_itm_type[]>([])

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

watch(userActions,()=>{
  OperationItem.value= [
      AppItems.getTransfertItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(transferts_action.read))),
      AppItems.getDepotItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(depots_action.read))),
      AppItems.getRetraitItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(retraits_action.read))),
      AppItems.getCodeMoneyItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(codes_money_action.read))),
  ]
  CaisseItem.value=[
      AppItems.getMouvementsCaveauxItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(injections_action.read))),
      AppItems.getInjectioinsItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(injections_action.read))),
      AppItems.getAutoInjectioinsItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(auto_inections_action.read))),
      AppItems.getDettesItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(dettes_action.read))),
      AppItems.getEmpruntsItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(emprunts_action.read))),
      AppItems.getEpargnesItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(epargnes_action.read))),
      AppItems.getChargesFictivesItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(charges_fictives_action.read))),
      AppItems.getChargesRellesItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(charges_relles_action.read))),
  ]
  ParameterItem.value = [
    AppItems.getCountryItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(country_action.read))),
    AppItems.getFeesItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(fees_action.read))),
    AppItems.getCurrencyItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(currency_action.read))),
    AppItems.getCommissionItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(partner_fees_action.read))),
    AppItems.getCaveauxItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(caveaux_action.read))),
    AppItems.getPartnerItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(partner_action.read))),
    AppItems.getRoleItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(role_action.read))),
  ]
  AgencyItem.value = [
    AppItems.getManageAgencyItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(agency_action.read))),
    AppItems.getManageSubscriptionItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(subscription_action.read))),
    AppItems.getMyAgencyItem(userActions.value?.app_role?.app_action?.some((action:app_action)=>action.code.includes(subscription_action.read)))
  ]
})
</script>

<template>
  <!---@ts-nocheck--->
  <el-container>
    <el-header>
      <el-row>
        <DashboardIcon/>
        <el-text size="large">
          Alsaba-Money
        </el-text>
      </el-row>
    </el-header>
    <el-main>
      <el-scrollbar>
        <el-col :span="24">
          <el-menu
              active-text-color="#F90511"
              background-color="#545c64"
              default-active="2"
              text-color="#fff"
              @open="handleOpen"
              @close="handleClose"
          >
            <el-menu-item index="2" @click="router.push('/')">
              <el-icon><i-carbon-analytics/></el-icon>
              <el-text>Bilan</el-text>
            </el-menu-item>
            <el-sub-menu index="1">
              <template #title>
                <el-icon ><Icon icon="subway:round-arrow-1" /></el-icon>
                <el-text size="small">
                  Operations
                </el-text>
              </template>
              <el-menu-item :index="item.index" v-for="item in OperationItem.filter((value)=>!value?.show)" >
                <template #title>
                  <el-space @click="router.push(item?.route)">
                    <el-icon ><Icon :icon="item.icon" /></el-icon>
                    <el-text size="small" >
                      {{item.name}}
                    </el-text>
                  </el-space>
                </template>
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon ><Icon icon="la:sellcast" /></el-icon>
                <el-text size="small">
                  Caisse
                </el-text>
              </template>
              <el-menu-item :index="item.index" v-for="item in CaisseItem.filter((value)=>!value.show)">
                <template #title>
                  <el-space @click="router.push(item?.route)">
                    <el-icon ><Icon :icon="item.icon" /></el-icon>
                    <el-text size="small" >
                      {{item.name}}
                    </el-text>
                  </el-space>
                </template>
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon ><Icon icon="mingcute:bank-fill" /></el-icon>
                <el-text size="small">
                  Agences
                </el-text>
              </template>
              <el-menu-item :index="item.index" v-for="item in AgencyItem.filter((value)=>value?.show)" >
                <template #title>
                  <el-space @click="router.push(item?.route)">
                    <el-icon ><Icon :icon="item.icon" /></el-icon>
                    <el-text size="small" >
                      {{item.name}}
                    </el-text>
                  </el-space>
                </template>
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon ><Icon icon="ic:baseline-settings" /></el-icon>
                <el-text size="small">
                  Paramètrage et autres
                </el-text>
              </template>
              <el-menu-item :index="item.index" v-for="item in ParameterItem.filter((value)=>value?.show)" >
                <template #title >
                  <el-space @click="router.push(item?.route)">
                    <el-icon ><Icon :icon="item.icon" /></el-icon>
                    <el-text size="small" >
                      {{item.name}}
                    </el-text>
                  </el-space>
                </template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </el-scrollbar>
    </el-main>
    <el-footer>
      <user-connected-banner/>
    </el-footer>
  </el-container>
</template>

<style scoped>
  .el-menu{
    border-radius: 10px;
  }
  .el-menu .el-text{
    color : #f5f5f5;
  }
  .el-container{
    background-color: #f5f5f5!important;
    box-shadow: var(--el-box-shadow-lighter);
  }
  .el-header .el-row{
    align-items: center;
  }
  .el-header{
    align-items: center;
    padding-top: 10px;
  }
  .el-header .el-text{
    font-family: "Arial Black" , sans-serif;
    margin-left: 10px;
    color: #F90511;
  }
  .el-footer{
    padding-top: 10px;
    border-top: var(--el-border);
  }
  .el-icon{
    color: #F90511;
  }
</style>