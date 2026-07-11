import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { candidatureService } from './services'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem('user_token'))

  const user = ref<any>(JSON.parse(localStorage.getItem('user_data') || 'null'))

  const candidatures = ref<any[]>([])

  const notes = ref<any[]>([])

  const CompteTuilisateur = ref<any[]>([])

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(newToken: string, userData: any) {
    if (!newToken || typeof newToken !== 'string') {
      console.error('Token invalide')
      return
    }

    token.value = newToken
    sessionStorage.setItem('user_token', newToken)

    if (userData && typeof userData === 'object') {
      user.value = userData
      const safeUserData = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        role: userData.role,
      }
      localStorage.setItem('user_data', JSON.stringify(safeUserData))
    }
  }

  //j'appelle le service
  async function fetchCandidatures() {
    try {
      const data = await candidatureService.getAll(token.value)
      candidatures.value = data
    } catch (err) {
      if (TokenExpired(err)) return
      console.error('Erreur lors du chargement coté store:', err)
      throw err
    }
  }

  //La supression
  async function deleteCandidatures(id: number) {
    try {
      await candidatureService.delete(id, token.value)
      await fetchCandidatures()
    } catch (err) {
      if (TokenExpired(err)) return
      throw err
    }
  }

  //les notes
  async function fetchNotes() {
    try {
      const data = await candidatureService.getAllNotes(token.value)
      notes.value = data
    } catch (err) {
      if (TokenExpired(err)) return
      console.error('Erreur lors du chargement des notes coté store:', err)
      throw err
    }
  }

  async function addNotes(note: any) {
    try {
      await candidatureService.addNotes(note, token.value)
      await fetchNotes()
    } catch (err) {
      if (TokenExpired(err)) return
      throw err
    }
  }

  async function UpdateNotes(id: number, note: any) {
    try {
      await candidatureService.UpdateNotes(id, note, token.value)
      await fetchNotes()
    } catch (err) {
      if (TokenExpired(err)) return
      throw err
    }
  }

  async function deleteNotes(id: number) {
    try {
      await candidatureService.deleteNotes(id, token.value)
      await fetchNotes()
    } catch (err) {
      if (TokenExpired(err)) return
      throw err
    }
  }

  //Admin

  async function fetchUsers() {
    try {
      const data = await candidatureService.getAllUser(token.value)
      CompteTuilisateur.value = data
    } catch (err) {
      if (TokenExpired(err)) return
      console.error('Erreur lors du chargemnt des utilisateurs', err)
      CompteTuilisateur.value = []
      throw err
    }
  }

  function TokenExpired(err: any) {
    if (err.response && err.response.status === 401) {
      clearToken()
      window.location.href = '/connexion'
      return true
    }
    return false
  }

  function clearToken() {
    token.value = null
    user.value = null
    candidatures.value = []
    notes.value = []
    CompteTuilisateur.value = []
    sessionStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
  }

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    clearToken,
    candidatures,
    fetchCandidatures,
    deleteCandidatures,
    notes,
    fetchNotes,
    addNotes,
    UpdateNotes,
    deleteNotes,
    fetchUsers,
    CompteTuilisateur,
  }
})
