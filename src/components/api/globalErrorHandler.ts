export class GlobalErrorHandler {
    static process_error(errors:number , message="une erreure est survenue lors de l'ajout ou mise à jour de cette données veillez reéssayé" ):string{
        console.log(errors)
        switch (errors){
            case 422 : {
                return "données invalide veillez vérifier les données saisies"
            }
            case 409 : {
                return "ces données existe déjà"
            }
            default:{
                return message
            }
        }
    }
}