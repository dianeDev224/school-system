import {User} from "@supabase/supabase-js";

export type user_profile = {
    id?:number
    phone_number?: string
    firstname?   : string
    lastname?    : string
    photo?       : string
    email?:string
    role_id?:number
    user_id?:string
    agency_id?:number
    app_role?:app_role
    user?:User
    agency?:agency
}

export type app_role = {
    id?:number
    role_name:string
    app_action? : app_action[]
}

export type app_action = {
    id?:number
    action_name : string
    code:string
    app_role? : app_role[]
}

export type app_action_role = {
    id?:number
    role_id : number
    action_id : number
    app_action? : app_action
    app_role? : app_role
}

export type user_action = {
    action_name : string
    code:string
    role_id : number
    action_id : number
}


export type country = {
    id?:number
    country_name : string
    code:string
    capital:string
    shortname:string
    currency:string
    town?:town[]
}

export type town = {
    id?:number
    town_name : string
    country_id : number
    neighborhood? : neighborhood[]
}

export type neighborhood = {
    id?:number
    neighborhood_name:string
    town_id :number
}

export type currency = {
    id?:number
    currency : number
    base_country_id:number
    target_country_id:number
    base_country? : country
    target_country? : country
}

export type fees = {
    id?:number
    base_country_id:number
    target_country_id:number
    lower_bound:number
    upper_bound:number
    fees:number
    fees_type:number
    base_country? : country
    target_country? : country
}

export type commission = {
    id?:number
    base_country_id:number
    target_country_id:number
    base_country_rate:number
    target_country_rate:number
    base_country? : country
    target_country? : country
}

export type caveaux  = {
    id?:number
    caveaux_name:string
    agency_id:number
    agency? : agency
    caveaux_line? : caveaux_line[]
}

export type caveaux_line = {
    id?:number
    amount:number
    date:Date
    caveaux_id:number
    caveaux? : caveaux
}

export type partner_fees = {
    id?:number
    base_country_id:number
    target_country_id:number
    lower_bound:number
    upper_bound:number
    fees:number
    fees_type:number
    base_country? : country
    target_country? : country
}

export type partner = {
    id?:number
    partner_name:string
    shortname : string
    partner_fees?:partner_fees[]
}




export type subscription = {
    id?:number
    agency_name?:string
    agency_shortname?:string
    agency_phone?:string
    agency_type?:number
    agency_level?:number
    agency_owner_first_name?:string
    agency_owner_last_name?:string
    agency_owner_phone_number?:string
    agency_owner_email?:string
    agency_owner_password?:string
    agency_owner_photo?:string
    agency_country_id?:number
    agency_town_id?:number
    agency_neighborhood_id?:number
    agency_neighborhood?:neighborhood
    agency_country?:country
    agency_town?:town
}

export type agency = {
    id?:number
    agency_name?:string
    agency_shortname?:string
    agency_phone?:string
    agency_type?:number
    agency_owner_id ?: number
    agency_level?:number
    agency_country_id?:number
    agency_town_id?:number
    agency_neighborhood_id?:number
    agency_country?:country
    agency_town?:town
    agency_neighborhood?:neighborhood
    agency_owner?:user_profile
    caveaux?:caveaux[]
    user?:user_profile[]
}


export type transfert = {
    id?:number ;
    date?:Date ;
    transfert_code?:string ;
    transfert_mal?:number ;
    transfert_type?:number ;
    transfert_livraisontype?:number;
    transfert_expeditaire_firstname?:string ;
    transfert_expeditaire_lastname?:string ;
    transfert_expeditaire_phone_number?:string ;
    transfert_destinataire_firstname?:string ;
    transfert_destinataire_lastname?:string ;
    transfert_destinataire_phone_number?:string ;
    transfert_partner_id?:number ;
    transfert_caveaux_id?:number ;
    transfert_base_agency_id?:number ;
    transfert_target_agency_id?:number ;
    transfert_target_country_id?:number ;
    transfert_target_town_id?:number ;
    transfert_alsaba_fees_id?:number ;
    transfert_partner_fees_id?:number ;
    canceled_at?:Date ;
    validated_at?:Date;
    transfert_partner?:partner ;
    transfert_caveaux?:caveaux ;
    transfert_base_agency?:agency ;
    transfert_target_agency?:agency ;
    transfert_target_country?:country ;
    transfert_target_town?:town ;
    transfert_alsaba_fees?:fees ;
    transfert_partner_fees?:partner_fees ;
}

