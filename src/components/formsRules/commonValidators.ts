
export const phoneNumberValidator = ({}, value: string, callback: any , form:any , fieldName:string)=> {
    if (value.length < 9) {
        callback(new Error('le telephone doit contenir 9 chiffres sans le code du pays'))
    }
    else if(value[0]=="0"){
        form[fieldName] = value.slice(1)
        callback()
    }
    else if(value.length > 9){
        form[fieldName] = value.slice(0,8)
        callback()
    }
    else {
        callback()
    }

}