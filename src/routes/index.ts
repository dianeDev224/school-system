// @ts-nocheck
import {createMemoryHistory , createRouter} from 'vue-router'
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import supabase from "@/data-source.ts";


const routes = [
    {
        path : "/" ,
        name : "dashboard" ,
        component : DashboardView ,
        children : [
            {
                path : "" ,
                name : "tableau de bord/bilan" ,
                component : HomeView
            } ,
            {
                path : "/transfert" ,
                name : "operatioins/Transfert" ,
                component : () => import("@/views/TransfertView.vue")
            },
            {
                path : "/depot" ,
                name : "operatioins/depôt" ,
                component : () => import("@/views/DepotView.vue")
            },
            {
                path : "/retrait" ,
                name : "operatioins/retrait" ,
                component : () => import("@/views/RetraitView.vue")
            },
            {
                path : "/code-money" ,
                name : "operatioins/code money" ,
                component : () => import("@/views/CodeMoneyView.vue")
            },
            {
                path : "/emprunts" ,
                name : "caisses/emprunts" ,
                component : () => import("@/views/EmpruntView.vue")
            },
            {
                path : "/dettes" ,
                name : "caisses/dettes" ,
                component : () => import("@/views/DetteView.vue")
            },
            {
                path : "/charges-fictives" ,
                name : "caisses/charges fictives" ,
                component : () => import("@/views/ChargesFictivesView.vue")
            },
            {
                path : "/charges-réèlles" ,
                name : "caisses/charges réèlles" ,
                component : () => import("@/views/ChargesReellesView.vue")
            },
            {
                path : "/epargnes" ,
                name : "caisses/epargnes" ,
                component : () => import("@/views/EpargnesView.vue")
            },
            {
                path : "/injections" ,
                name : "caisses/injections" ,
                component : () => import("@/views/InjectionView.vue")
            },
            {
                path : "/auto-injections" ,
                name : "caisses/auto-injections" ,
                component : () => import("@/views/AutoInjectionView.vue")
            },{
                path : "/mouvements-caveaux" ,
                name : "caisses/mouvements caveaux" ,
                component : () => import("@/views/MouvementCaveauxView.vue")
            },
            {
                path : "/country" ,
                name : "paramètre et autres / pays" ,
                component : ()=> import("@/views/CountryView.vue")
            },
            {
                path : "/fees" ,
                name : "paramètre et autres / frais" ,
                component : () => import("@/views/FeesView.vue")
            },
            {
                path : "/currency" ,
                name : "paramètre et autres / taux d'échange" ,
                component : () => import("@/views/CurrencyView.vue")
            },
            {
                path : "/commission" ,
                name : "paramètre et autres / commission" ,
                component : () => import("@/views/CommissionView.vue")
            },
            {
                path : "/caveaux" ,
                name : "paramètre et autres / caveaux" ,
                component : () => import("@/views/CaveauxView.vue")
            },
            {
                path : "/partner" ,
                name : "paramètre et autres / Partanaires" ,
                component : () => import("@/views/PartanerView.vue")
            },
            {
                path : "/user-role" ,
                name : "paramètre et autres / gestion des roles" ,
                component : () => import("@/views/RoleManagementView.vue")
            },
            {
                path : "/manage-subscription" ,
                name : "Agences / gestion des demandes" ,
                component : () => import("@/views/ManageSubscriptionView.vue")
            },
            {
                path : "/manage-agence" ,
                name : "Agences / gestion des agences" ,
                component : () => import("@/views/ManageAgenceView.vue")
            },
            {
                path : "/my-agence" ,
                name : "Agences / Mon Agence" ,
                component : () => import("@/views/MyAgenceView.vue")
            }
        ]
    } ,
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

router.beforeEach(async(to, from) => {
    const user = await supabase.auth.getUser()
    if(user.error && to.name !== 'login' && from){
        return { name: 'login' }
    }
})

export {router}