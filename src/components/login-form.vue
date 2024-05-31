
<script setup lang="ts">
// @ts-nocheck
import {onMounted, reactive, ref} from "vue";
import {FormInstance} from "element-plus";
import CountryFlag from "@/components/icons/country-flag.vue";
import {country} from "@/types/database-types.ts";
import {Loader, openErrorNotification, openSuccessNotification} from "@/components/utils/AppLoader.ts";
import {CountryService} from "@/components/api/country.service.ts";
import {UserService} from "@/components/api/user.service.ts";
import {resetForm} from "@/components/utils/FormValidator.ts";
import {AgencyRules} from "@/components/formsRules/login.rule.ts";
import {LoginType} from "@/types/app.type.ts";

const countryData = ref<country[]>([])

const form = reactive<LoginType>({
  phoneNumber: '',
  password: '',
})
const currentCountry = ref<country>()
const formRef = ref<FormInstance>()


const onSubmit = async(formEl: FormInstance | undefined) => {
  if(!formEl) return
  const result = await formEl.validate()
  if(result){
  Loader.showLoader('AUTHENTIFICATION EN COURS')
    await UserService.login(currentCountry.value?.code.concat(form.phoneNumber) , form.password ,
        ()=>{
          openSuccessNotification("Authentification","vous êtes authentifié avec succès")
          resetForm(formEl)
        },
        ()=>openErrorNotification("Authentification","telephone ou mot de passe invalid"))
    resetForm(formEl)
    Loader.hideLoader()
  }
}
onMounted(async() => {
  countryData.value =  await CountryService.getCountries()
  fetch('https://api.ipify.org/?format=json')
      .then(response => response.json())
      .then(data => {
        fetch('http://ip-api.com/json/'+data.ip+'?lang=fr')
            .then(response => response.json())
            .then(data => {
              countryData.value.filter((country)=>{
                if(country.country_name.toLowerCase() == data.country.toLowerCase()){
                  currentCountry.value = country
                }
              })
            })
      })
})
</script>

<template>
  <!---@ts-nocheck--->
  <el-row>
    <el-form ref="formRef" :model="form" :rules="AgencyRules(form)"   style="min-width: 70%">
      <el-row>
        <el-text size="large" style="color: var(--el-color-primary)">
          Authentification
        </el-text>
      </el-row>
      <el-space direction="vertical" style="width: 100%">
        <el-form-item prop="phoneNumber">
          <el-input v-model="form.phoneNumber" type="text" >
            <template #prepend>
              <el-icon>
                <el-select no-match-text="aucune correspondance trouvé" no-data-text="aucun pays trouvé"   style="width: 51px"   v-model="currentCountry">
                  <el-option
                      v-for="item in countryData"
                      :key="item.id"
                      :label="item.country_name"
                      :value="item"
                  >
                    <el-space>
                      <country-flag :image-name="item.shortname.toLowerCase()"/>
                      <el-text size="small">
                        {{item?.country_name.toUpperCase()}}
                      </el-text>
                    </el-space>
                  </el-option>
                  <template v-if="currentCountry" #prefix>
                    <el-space>
                      <country-flag :image-name="currentCountry.shortname.toLowerCase()"/>
                    </el-space>
                  </template>
                </el-select>
              </el-icon>
            </template>
            <template #prefix>
              <el-icon>
                {{currentCountry?.code}}
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password">
            <template #prepend>
              <el-icon>
                <i-bi-key/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="onSubmit(formRef)" style="--el-button-bg-color: #9a040c ; --el-button-border-color: #9a040c ; --el-button-hover-bg-color: #a41823 ; --el-button-hover-border-color: #a41823 ">Se connecter</el-button>
        </el-form-item>
      </el-space>
    </el-form>
  </el-row>
</template>

<style scoped>
  .el-row{
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 20px;
    color: #F90511;
  }

  .el-text{
    font-family: "Arial Black",serif;
  }

  .el-button .el-input{
    width: 100%;
  }
</style>