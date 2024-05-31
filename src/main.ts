// @ts-nocheck
import {createApp} from 'vue'
import '@/style.css'
import App from '@/App.vue'
import {router} from "@/routes";
import {ElMessageBox} from "element-plus";
import supabase from "@/data-source.ts";


import fr from 'element-plus/es/locale/lang/fr'





createApp(App).use({locale: fr}).use(router).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
  const open = () => {
    ElMessageBox(
        {
          title : 'Information',
          message : "voulez-vous vraiment quitter l'application?",
          showCancelButton : true ,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non',
          type: 'warning',
        }
    ).then((action) => {
      if(action == "confirm"){
        supabase.auth.signOut()
        window.ipcRenderer.send("app-quit")
      }
    })
  }
  window.ipcRenderer.on("app-quitting" , open) ;

})
