import {describe, expect, it} from "vitest";
import supabase from "@/data-source.ts";

describe("register new user" , ()=>{
    it('it should register new user' , async()=>{

        const new_user = await supabase.auth.signUp({
            email: 'dianeoumar224@email.com',
            password: '1234567',
        })
        console.log(new_user)
        if(new_user.data.session){
            const new_user_profil = await supabase
                .from('user_profile')
                .insert([
                    { phone_number: '+224622228148', firstname: 'oumar' , lastname :"diane" , user_id:new_user.data.user?.id},
                ])
                .select()
            console.log(new_user_profil.data)
            expect(new_user_profil.data?.length).toBeGreaterThan(0)
            expect(new_user_profil.error).toBeNull
        }
    })
})

describe("user authentication" , ()=>{
    it("should signin a user" , async()=>{
        let user_email= await supabase.rpc('user_email' , {phone_number : "+212648529316"})
        const { data, error } = await supabase.auth.signInWithPassword({
            email: user_email.data?.[0].email,
            password: '123',
        })
        expect(data).haveOwnProperty("session")
        console.log(data)
        expect(!data.user).toBe(false)
        expect(error).toBeNull
    })
})
