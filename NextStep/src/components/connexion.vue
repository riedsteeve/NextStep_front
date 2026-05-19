<script setup lang="ts">
import axios from 'axios';
import { reactive } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter()
const authStore = useAuthStore()

const Utilisateur = reactive({
  email: '',
  password: ''
});

const messageVisible = ref(false)
const ConnexionMessage = 'Connexion réussie'
const errorVisible = ref(false)
const failedMessage = ref("Respecté la longeur du mot de passe prévu")

const URL_CONNEXION = import.meta.env.VITE_CONNEXION_API;

const submitForm = async (): Promise<void> => {
  try{
    messageVisible.value = true
    errorVisible.value = false
    const response = await axios.post(
      URL_CONNEXION,
      {
        email:Utilisateur.email,
        password: Utilisateur.password
      },
      {
        headers : 
        {
          'Content-Type' : 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      },
    );
    //je récupere le token et je l'nrégistre dans Pinia
    const token = response.data.token
    const user = response.data.user
    
    if (token && user) {
      authStore.setAuth(token, user);
  
  setTimeout(() => {
    router.push("/dashboard");
  }, 2000);
} else {
  // Si l'API a répondu mais qu'il manque des morceaux
  console.error("Données de connexion incomplètes reçues du serveur.");
  failedMessage.value = "Erreur technique : réponse du serveur incomplète.";
  errorVisible.value = true;
}

    /*
    console.log("Le token récupéré avec succès :", token)
    authStore.setAuth(token, user)
    console.log(user)
    if (!token) {
      throw new Error("Le serveur n'a pas renvoyé de jeton de session valide.");
    }
    */
    console.log("Connexion validé")
  }
  catch(err :any){
    messageVisible.value = false
    errorVisible.value = true
    console.error("Connexion impossible")
    /*
    if(err.response.status === 400){
        failedMessage.value = "Identifiants incorrects"
    } 
    */
  }
}

</script>

<template>
  <div class="min-h-screen flex flex-col items-center pt-35 bg-gray-200 gap-8 pb-10 p-5">

    <div class="w-full max-w-xl p-6 bg-white shadow-xl text-black rounded-md flex flex-col items-center text-center">
      <form
        @submit.prevent="submitForm"
        class="w-full bg-white p-8 rounded-xl flex flex-col gap-4 m-2"
      >
        <h2 class="text-2xl font-bold text-center text-purple-600">Connexion</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="prenom" class="text-sm font-medium text-gray-700 text-left">Email</label>
            <input
                type="text"
                id="prenom"
                v-model="Utilisateur.email"
                placeholder="Entrez votre email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-medium text-gray-700 text-left">Mot de passe</label>
            <input
                type="password"
                id="password"
                v-model="Utilisateur.password"
                placeholder="********"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>
        </div>

        <button
          type="submit"
          class="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition font-bold mt-2"
        >
          Connexion
        </button>

        <p v-if="messageVisible"
            class="text-sm font-medium text-center p-3 rounded-lg bg-purple-200 text-black"
          >
          {{ ConnexionMessage }}
          </p>
          <p v-if="errorVisible"
            class="text-sm font-medium text-center p-3 rounded-lg bg-red-200 text-black"
          >
          {{ failedMessage }}
          </p>

      </form>

    </div>
  </div>

</template>