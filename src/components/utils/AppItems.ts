
export class AppItems {
    static getTransfertItem(show:boolean = false) {
        return {
            index : "1-1" ,
            name : "Transfert" ,
            icon : "vaadin:money-withdraw",
            show : show,
            route: {path: "/transfert"}
        }
    }
    static getCodeMoneyItem(show:boolean = false) {
        return {
            index : "1-2" ,
            name : "Code Money" ,
            icon: "mingcute:cash-fill" ,
            show : show,
            route: {path: "/code-money"}
        }
    }
    static getDepotItem(show:boolean = false) {
        return {
            index :"1-3" ,
            name : "Depôt" ,
            icon : "solar:cash-out-broken" ,
            show : show,
            route: {path: "/depot"}
        }
    }
    static getRetraitItem(show:boolean = false) {
        return {
            index : "1-4" ,
            name : "Retrait" ,
            icon: "solar:cash-out-broken",
            show : show,
            route: {path: "/retrait"}
        }
    }
    static getEmpruntsItem(show:boolean = false) {
        return {
            index : "2-1" ,
            name : "Emprunts" ,
            icon : "solar:cash-out-broken",
            show : show,
            route: {path: "/emprunts"}
        }
    }
    static getDettesItem(show:boolean = false) {
        return {
            index : "2-2" ,
            name : "Dettes" ,
            icon: "solar:cash-out-broken" ,
            show : show,
            route: {path: "/dettes"}
        }
    }
    static getChargesRellesItem(show:boolean = false) {
        return {
            index :"2-3" ,
            name : "Charges réelles" ,
            icon : "solar:cash-out-broken" ,
            show : show,
            route: {path: "/charges-réèlles"}
        }
    }
    static getChargesFictivesItem(show:boolean = false) {
        return {
            index : "2-4" ,
            name : "Charges Fictives" ,
            icon: "solar:cash-out-broken",
            show : show,
            route: {path: "/charges-fictives"}
        }
    }
    static getEpargnesItem(show:boolean = false) {
        return {
            index : "2-5" ,
            name : "Epargnes" ,
            icon: "solar:cash-out-broken",
            show : show,
            route: {path: "/epargnes"}
        }
    }
    static getInjectioinsItem(show:boolean = false) {
        return {
            index : "2-6" ,
            name : "Injections" ,
            icon: "solar:cash-out-broken",
            show : show,
            route: {path: "/injections"}
        }
    }
    static getAutoInjectioinsItem(show:boolean = false) {
        return {
            index : "2-7" ,
            name : "Auto Injections" ,
            icon: "solar:cash-out-broken",
            show : show,
            route: {path: "/auto-injections"}
        }
    }
    static getMouvementsCaveauxItem(show:boolean = false) {
        return {
            index : "2-8" ,
            name : "Mouvements Caveaux" ,
            icon: "solar:cash-out-broken",
            show : show,
            route: {path: "/mouvements-caveaux"}
        }
    }
    static getManageAgencyItem(show:boolean = false) {
        return {
            index: "3-1",
            name: "Gestion des agences",
            icon: "ri:building-fill",
            show: show,
            route: {path: "/manage-agence"}
        }
    }
    static getManageSubscriptionItem(show:boolean = false) {
        return {
            index: "3-2",
            name: "Gestion des demandes",
            icon: "ri:file-list-3-fill",
            show: show,
            route: {path: "/manage-subscription"}
        }
    }
    static getMyAgencyItem(show:boolean = false) {
        console.log("executed : ", show)
        return {
            index: "3-3",
            name: "Mon Agence",
            icon: "ri:building-2-fill",
            show: show,
            route: {path: "/my-agence"}
        }
    }
    static getCountryItem(show:boolean = false) {
        return {
            index: "4-1",
            name: "Pays",
            icon: "material-symbols-light:globe",
            show: show,
            route: {path: "/country"}
        }
    }
    static getFeesItem(show:boolean = false) {
        return {
            index: "4-2",
            name: "Frais",
            icon: "material-symbols-light:money",
            show: show,
            route: {path: "/fees"}
        }
    }
    static getCurrencyItem(show:boolean = false) {
        return {
            index: "4-3",
            name: "Taux d'échange",
            icon: "ri:currency-fill",
            show: show,
            route: {path: "/currency"}
        }
    }
    static getFeesTypeItem(symbol:string = "") {
        return [
            {
                code : 1 ,
                name : "Valeure fixe" ,
                symbol : symbol
            } ,
            {
                code : 2 ,
                name : "Pourcentage" ,
                symbol : "%"
            }
        ]
    }
    static getCommissionItem(show:boolean = false) {
        return {
            index: "4-4",
            name: "Commission",
            icon: "ri:money-dollar-circle-fill",
            show: show,
            route: {path: "/commission"}
        }
    }
    static getCaveauxItem(show:boolean = false) {
        return {
            index: "4-5",
            name: "Caveaux",
            icon: "ri:bank-fill",
            show: show,
            route: {path: "/caveaux"}
        }
    }
    static getPartnerItem(show:boolean = false) {
        return {
            index: "4-6",
            name: "Partenaires",
            icon: "ri:team-fill",
            show: show,
            route: {path: "/partner"}
        }
    }
    static getRoleItem(show:boolean = false) {
        return {
            index: "4-7",
            name: "Gestion des roles",
            icon: "ri:admin-fill",
            show: show,
            route: {path: "/user-role"}
        }
    }
}