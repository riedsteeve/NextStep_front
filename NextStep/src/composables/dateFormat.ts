export function useDateFormat() {
  
  const formatApiDate = (dateIso: string): string => {
    if (!dateIso) return 'Date inconnue'
    
    const date = new Date(dateIso)
    
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // On exporte uniquement la fonction que tu veux
  return {
    formatApiDate
  }
}