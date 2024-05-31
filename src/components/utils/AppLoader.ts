import {ElLoading, ElNotification} from "element-plus";

export class Loader{
    static loadingInstance: any;
    static showLoader(text:string="chargement des données"){
        this.loadingInstance = ElLoading.service({
            lock: true,
            text: text,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }
    static hideLoader(){
        this.loadingInstance.close();
    }
}

export const openSuccessNotification = (title:string='Authentification' , message:string='vous êtes authentifié avec succès') => {
    ElNotification({
        title: title,
        message: message,
        type: 'success',
    })
}


export const openErrorNotification = (title:string ='Authentification'  ,  message:string='') => {
    ElNotification({
        title: title,
        message: message,
        type: 'error',
    })
}
