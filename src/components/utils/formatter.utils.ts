export function formatDate(timestamp:string) {
    // Convertir le timestamp en objet Date
    const date = new Date(timestamp);
    // Formater la date
    return date.toLocaleDateString('fr-FR' , {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}