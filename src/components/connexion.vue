<script setup lang="ts">
import axios from 'axios'
import { reactive } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const authStore = useAuthStore()

const Utilisateur = reactive({
  email: '',
  password: '',
})
const isLoading = ref(false)

const messageVisible = ref(false)
const ConnexionMessage = 'Connexion réussie, vous allez redirigé vers votre espace personnel'
const errorVisible = ref(false)
const failedMessage = ref('Identifiants incorrect')

const URL_CONNEXION = import.meta.env.VITE_CONNEXION_API

const submitForm = async (): Promise<void> => {
  try {
    messageVisible.value = true
    errorVisible.value = false
    const response = await axios.post(
      URL_CONNEXION,
      {
        email: Utilisateur.email,
        password: Utilisateur.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      },
    )
    //je récupere le token et je l'nrégistre dans Pinia
    const token = response.data.token
    const user = response.data.user

    if (token && user) {
      authStore.setAuth(token, user)
      router.push('/dashboard')
    } else {
      failedMessage.value = 'Erreur technique'
      errorVisible.value = true
    }

    /*
    console.log("Le token récupéré avec succès :", token)
    authStore.setAuth(token, user)
    console.log(user)
    if (!token) {
      throw new Error("Le serveur n'a pas renvoyé de jeton de session valide.");
    }
    */
    //console.log("Connexion validé")
  } catch (err: any) {
    messageVisible.value = false
    errorVisible.value = true
    if (err.response?.data?.message) {
      failedMessage.value = err.response.data.message
    } else {
      failedMessage.value = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
    }
    //console.error("Connexion impossible")
    /*
    if(err.response.status === 400){
        failedMessage.value = "Identifiants incorrects"
    } 
    */
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8 sm:px-6">
    <div
      class="flex w-full max-w-md flex-col items-center rounded-xl bg-white text-center text-black shadow-xl"
    >
      <form
        @submit.prevent="submitForm"
        class="flex w-full flex-col gap-5 rounded-xl bg-white p-5 sm:p-8"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-center text-2xl font-bold text-purple-600">Connexion</h2>
          <p class="text-sm text-gray-500">Accédez à votre espace NextStep.</p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="email" class="text-left text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="Utilisateur.email"
              placeholder="Entrez votre email"
              required
              class="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-2 text-black shadow-sm transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-left text-sm font-medium text-gray-700"
              >Mot de passe</label
            >
            <input
              type="password"
              id="password"
              v-model="Utilisateur.password"
              placeholder="********"
              required
              class="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-2 text-black shadow-sm transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          class="mt-2 min-h-12 w-full rounded-lg bg-purple-600 px-4 font-bold text-white transition hover:bg-purple-700 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Connexion en cours' : 'Connexion' }}
        </button>

        <p
          v-if="messageVisible"
          class="rounded-lg bg-purple-200 p-3 text-center text-sm font-medium text-black"
        >
          {{ ConnexionMessage }}
        </p>
        <p
          v-if="errorVisible"
          class="rounded-lg bg-red-200 p-3 text-center text-sm font-medium text-black"
        >
          {{ failedMessage }}
        </p>
      </form>
    </div>
  </div>
</template>
