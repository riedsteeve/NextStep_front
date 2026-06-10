<script setup lang="ts">
import { reactive } from 'vue'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const isLoading = ref(false)
const Utilisateur = reactive({
  nom: '',
  prenom: '',
  email: '',
  password: '',
})

const messageVisible = ref(false)
const CreatingAccountMessage =
  'Votre compte a été bien créé, vous allez etre ridirigé vers le formulaire de connexion'
const errorVisible = ref(false)
const failedMessage = ref('Respecté la longeur du mot de passe prévu')

const URL_REGISTER = import.meta.env.VITE_URL_REGISTER_API

const submitForm = async (): Promise<void> => {
  messageVisible.value = false
  errorVisible.value = false

  if (Utilisateur.password.length < 6) {
    errorVisible.value = true
    failedMessage.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }
  try {
    isLoading.value = true
    const response = await axios.post(
      URL_REGISTER,
      {
        first_name: Utilisateur.nom,
        last_name: Utilisateur.prenom,
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
    messageVisible.value = true
    setTimeout(() => {
      router.push('/connexion')
      isLoading.value = false
    }, 1000)
    //console.log(response,"Compte créé")
  } catch (err: any) {
    isLoading.value = false
    messageVisible.value = false
    errorVisible.value = true
    //console.error("Impossible d'envoyer ce post", err)
    //Vu que j'utilise supabase je met cette condition en cas de spam
    if (err.response?.status === 429) {
      failedMessage.value = 'Trop de tentatives. Veuillez patienter.'
    } else if (err.response?.data?.message) {
      failedMessage.value = err.response.data.message
    } else {
      failedMessage.value = "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
    }
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8 sm:px-6">
    <div
      class="flex w-full max-w-xl flex-col items-center rounded-xl bg-white p-5 text-center text-black shadow-xl sm:p-6"
    >
      <ul class="flex flex-wrap justify-center gap-2">
        <li
          class="rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white sm:px-4 sm:text-sm"
        >
          100% gratuit
        </li>
        <li
          class="rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white sm:px-4 sm:text-sm"
        >
          Sécurisé
        </li>
        <li
          class="rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white sm:px-4 sm:text-sm"
        >
          Sans publicité
        </li>
      </ul>

      <form
        @submit.prevent="submitForm"
        class="flex w-full flex-col gap-5 rounded-xl bg-white py-6 sm:px-4"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-center text-2xl font-bold text-gray-800">Créer votre compte</h2>
          <p class="text-sm text-gray-500">Suivez vos candidatures depuis un espace personnel.</p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="nom" class="text-left text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="nom"
              v-model.trim="Utilisateur.nom"
              placeholder="Entrez votre nom"
              required
              class="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-2 text-black shadow-sm transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="prenom" class="text-left text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="prenom"
              v-model.trim="Utilisateur.prenom"
              placeholder="Entrez votre prénom"
              required
              class="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-2 text-black shadow-sm transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="email" class="text-left text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model.trim="Utilisateur.email"
              placeholder="Entrez votre email"
              required
              class="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-2 text-black shadow-sm transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-left text-sm font-medium text-gray-700"
              >Mot de passe <span class="text-gray-400">(minimum 6 caractères)</span></label
            >
            <input
              type="password"
              id="password"
              v-model.trim="Utilisateur.password"
              placeholder="********"
              required
              minlength="6"
              class="min-h-12 w-full rounded-lg border border-gray-300 px-4 py-2 text-black shadow-sm transition duration-150 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          class="mt-2 min-h-12 w-full rounded-lg bg-purple-600 px-4 font-bold text-white transition hover:bg-purple-700 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Création du compte...' : 'Envoyé' }}
        </button>

        <p
          v-if="messageVisible"
          class="rounded-lg bg-purple-200 p-3 text-center text-sm font-medium text-black"
        >
          {{ CreatingAccountMessage }}
        </p>
        <p
          v-if="errorVisible"
          class="rounded-lg bg-red-200 p-3 text-center text-sm font-medium text-black"
        >
          {{ failedMessage }}
        </p>
      </form>
      <p class="text-sm leading-6">
        Vous avez déjà un compte ?
        <RouterLink to="/connexion" class="text-purple-600 hover:underline">
          Connectez-vous
        </RouterLink>
      </p>

      <p class="text-sm leading-6">
        <RouterLink to="/politique-confidentialite" class="text-purple-700 hover:underline">
          Politique de confidentialité
        </RouterLink>
      </p>
    </div>
  </div>
</template>
