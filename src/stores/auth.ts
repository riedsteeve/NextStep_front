import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { candidatureService } from './services'


export const useAuthStore = defineStore('auth',() => {
  //je vérifie si le token n'existe pas déja
  const token = ref<string | null>(localStorage.getItem('user_token'))

  const user = ref<any>(JSON.parse(localStorage.getItem('user_data') || 'null'))

  const candidatures = ref<any[]>([])

  const notes = ref<any[]>([])

  const CompteTuilisateur = ref<any[]>([])

  //Un getter qui renvoie true si le tokrn existe si non false
  const isAuthenticated = computed(() => !!token.value)

  //enrégistreme,nt du token
  function setAuth(newToken: string, userData: any) {
    //le token étais enrégistreé sous forme d'array mais je force la conversion
    const cleanToken = typeof newToken === 'string' ? newToken : String(newToken);
    token.value = cleanToken
    user.value = userData
    localStorage.setItem('user_token', cleanToken)
    //idem pour l'objet user
    if (userData && typeof userData === 'object') {
    localStorage.setItem('user_data', JSON.stringify(userData));
  } else {
    localStorage.setItem('user_data', String(userData));
  }
}


  //j'appelle le service
  async function fetchCandidatures() {
    try{
      const data = await candidatureService.getAll(token.value)
      candidatures.value = data
    }
    catch (err)
    {
      if (TokenExpired(err)) return
      console.error("Erreur lors du chargement coté store:", err)
      throw err
    }
  }

  //La supression
  async function deleteCandidatures(id:number) {
    try{
      await candidatureService.delete(id, token.value)
      await fetchCandidatures()
    }catch(err){
      if (TokenExpired(err)) return
      throw err
    }
  }

  //les notes
  async function fetchNotes() {
    try{
      const data = await candidatureService.getAllNotes(token.value)
      notes.value = data
    }
    catch (err)
    {
      if (TokenExpired(err)) return
      console.error("Erreur lors du chargement des notes coté store:", err)
      throw err
    }
  }

  async function addNotes(note: any) {
    try{
      await candidatureService.addNotes(note, token.value)
      await fetchNotes()
    }catch(err){
      if (TokenExpired(err)) return
      throw err
    }
  }

  async function UpdateNotes(id:number, note: any) {
    try{
      await candidatureService.UpdateNotes(id, note, token.value)
      await fetchNotes()
    }catch(err){
      if (TokenExpired(err)) return
      throw err
    }
  }

  async function deleteNotes(id:number) {
    try{
      await candidatureService.deleteNotes(id, token.value)
      await fetchNotes()
    }catch(err){
      if (TokenExpired(err)) return
      throw err
    }
  }

  //Admin

  async function fetchUsers() {
    try{
      const data = await candidatureService.getAllUser(token.value)
      CompteTuilisateur.value = data
    }
    catch (err){
      if (TokenExpired(err)) return
      console.error("Erreur lors du chargemnt des utilisateurs", err)
      CompteTuilisateur.value = []
      throw err
    }
  }

  function TokenExpired(err: any) {
    if(err.response && err.response.status === 401){
      clearToken()
      window.location.href = '/connexion'
      return true
    }
    return false
  }


  //fonction pour vider le token et on supprime aussi les candidatures si le token a disparu
  function clearToken() {
    token.value = null
    user.value = null
    candidatures.value = []
    notes.value = []
    CompteTuilisateur.value = []
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
  }

  return{
    token, user, isAuthenticated, setAuth, clearToken, candidatures, fetchCandidatures, deleteCandidatures, notes, fetchNotes, addNotes, UpdateNotes, deleteNotes, fetchUsers, CompteTuilisateur
  }
})
