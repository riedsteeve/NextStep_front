import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { an } from 'vue-router/dist/index-D_VEAp3P.js'

export const useAuthStore = defineStore('auth',() => {
  //je vérifie si le token n'existe pas déja
  const token = ref<string | null>(localStorage.getItem('user_token'))

  const user = ref<any>(JSON.parse(localStorage.getItem('user_data') || 'null'))
  //Un getter qui renvoie true si le tokrn existe si non false
  const isAuthenticated = computed(() => !!token.value)

  //enrégistreme,nt du token
  function setAuth(newToken: string, userData: any) {
    token.value = newToken
    user.value = userData
    localStorage.setItem('user_token', newToken)
    localStorage.setItem('user_data', userData)
  }

  //fonction pour vider le token
  function clearToken() {
    token.value = null
    user.value = null
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
  }

  return{
    token, user, isAuthenticated, setAuth, clearToken
  }
})