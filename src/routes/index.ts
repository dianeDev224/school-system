// @ts-nocheck
import {createMemoryHistory , createRouter} from 'vue-router'
import HomeView from "@/views/HomeView.vue";


const routes = [
    {
        path : "/" ,
        name : "dashboard" ,
        component : HomeView ,
    }
]



const router = createRouter({
    history : createMemoryHistory() ,
    routes : routes
})


export {router}