// @ts-nocheck

export enum transferts_action{
    create = "add_transferts" ,
    update = "update_transferts" ,
    delete = "delete_transferts" ,
    read = "read_transferts"
}

export enum depots_action{
    create = "add_depots" ,
    update = "update_depots" ,
    delete = "delete_depots" ,
    read = "read_depots"
}

export enum retraits_action{
    create = "add_retraits" ,
    update = "update_retraits" ,
    delete = "delete_retraits" ,
    read = "read_retraits"
}

export enum codes_money_action{
    create = "add_codes_money" ,
    update = "update_codes_money" ,
    delete = "delete_codes_money" ,
    read = "read_codes_money"
}

export enum caveaux_line_action{
    create = "add_caveaux_line" ,
    update = "update_caveaux_line" ,
    delete = "delete_caveaux_line" ,
    read = "read_caveaux_line"
}

export enum dettes_action{
    create = "add_dettes" ,
    update = "update_dettes" ,
    delete = "delete_dettes" ,
    read = "read_dettes"
}

export enum emprunts_action{
    create = "add_emprunts" ,
    update = "update_emprunts" ,
    delete = "delete_emprunts" ,
    read = "read_emprunts"
}

export enum charges_fictives_action{
    create = "add_charges_fictives" ,
    update = "update_charges_fictives" ,
    delete = "delete_charges_fictives" ,
    read = "read_charges_fictives"
}

export enum charges_relles_action{
    create = "add_charges_relles" ,
    update = "update_charges_relles" ,
    delete = "delete_charges_relles" ,
    read = "read_charges_relles"
}

export enum injections_action{
    create = "add_injections" ,
    update = "update_injections" ,
    delete = "delete_injections" ,
    read = "read_injections"
}

export enum auto_inections_action{
    create = "add_auto_inections" ,
    update = "update_auto_inections" ,
    delete = "delete_auto_inections" ,
    read = "read_auto_inections"
}

export enum epargnes_action{
    create = "add_epargnes" ,
    update = "update_epargnes" ,
    delete = "delete_epargnes" ,
    read = "read_epargnes"
}



export enum country_action {
    create = "add_country" ,
    update = "update_country" ,
    delete = "delete_country" ,
    read = "read_country"
}

export enum town_action {
    create = "add_town" ,
    update = "update_town" ,
    delete = "delete_town" ,
    read = "read_town"
}

export enum neighborhood_action {
    create = "add_neighborhood" ,
    update = "update_neighborhood" ,
    delete = "delete_neighborhood" ,
    read = "read_neighborhood"
}

export enum fees_action {
    create = "add_fees" ,
    update = "update_fees" ,
    delete = "delete_fees" ,
    read = "read_fees"
}

export enum currency_action {
    create = "add_currency" ,
    update = "update_currency" ,
    delete = "delete_currency" ,
    read = "read_currency"
}

export enum caveaux_action {
    create = "add_caveaux" ,
    update = "update_caveaux" ,
    delete = "delete_caveaux" ,
    read = "read_caveaux"
}

export enum role_action {
    create = "add_role" ,
    update = "update_role" ,
    delete = "delete_role" ,
    read = "read_role"
}

export enum partner_action {
    create = "add_partner" ,
    update = "update_partner" ,
    delete = "delete_partner" ,
    read = "read_partner"
}

export enum partner_fees_action {
    create = "add_partner_fees" ,
    update = "update_partner_fees" ,
    delete = "delete_partner_fees" ,
    read = "read_partner_fees"
}

export enum agence_user_action {
    create = "add_agence_user" ,
    update = "update_agence_user" ,
    delete = "delete_agence_user" ,
    read = "read_agence_user"
}

export enum subscription_action{
    create = "add_subscription" ,
    update = "update_subscription" ,
    delete = "delete_subscription" ,
    read = "read_subscription"
}

export enum agency_action{
    create = "add_agency" ,
    update = "update_agency" ,
    delete = "delete_agency" ,
    read = "read_agency"
}

export enum commission_action{
    create = "add_commision" ,
    update = "update_commision" ,
    delete = "delete_commision" ,
    read = "read_commision"
}

export type agency_level = {
    code:number ,
    name:string
}

export type agence_type = {
    code:number ,
    name:string
}

export type drop_down_type = {
    code:number ,
    name:string
}

export const agency_level_list:agency_level[]  = [
    {code:1 , name:"Agence De Pays"} ,
    {code:2 , name:"Agence  Normale"} ,
    {code:3 , name:"Agence De Siège"} ,
]

export const transfert_type_list:drop_down_type[]  = [
    {code:1 , name:"Transfert National"} ,
    {code:2 , name:"Transfert  Internation"} ,
]

export const transfert_livraison_type_list:drop_down_type[]  = [
    {code:1 , name:"Cash"} ,
    {code:2 , name:"Via un partenaire alsaba"} ,
]

export  const  agence_type_list:agence_type[] = [
    {code:1 , name:"Agence Partenaire"} ,
    {code:2 , name:"Agence Alsaba"}
]

export const  fees_type_list:drop_down_type[] = [
    { code : 1 ,name : "Valeure fixe" ,symbol : 'fixe'} ,
    {code : 2 ,name : "Pourcentage" ,symbol : "%"}
]