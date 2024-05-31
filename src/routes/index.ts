// @ts-nocheck
import {createMemoryHistory , createRouter} from 'vue-router'
import LoginView from "@/views/LoginView.vue";


const routes = [
    {
        path : "/login" ,
        name : "login" ,
        component : LoginView
    }
]

const router = createRouter({
    history : createMemoryHistory() ,
    routes : routes
})

export {router}