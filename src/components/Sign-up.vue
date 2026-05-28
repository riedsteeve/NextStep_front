<script setup lang="ts">
import { reactive } from 'vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()


const Utilisateur = reactive({
  nom: '',
  prenom: '',
  email: '',
  password: ''
});

const messageVisible = ref(false)
const CreatingAccountMessage = 'Votre compte a été bien créé, vous allez etre ridirigé vers le formulaire de connexion'
const errorVisible = ref(false)
const failedMessage = ref("Respecté la longeur du mot de passe prévu")

const URL_REGISTER = import.meta.env.VITE_URL_REGISTER_API;


const submitForm = async (): Promise<void> => {
  try {
    messageVisible.value = false
    errorVisible.value = false
    const response = await axios.post(
      URL_REGISTER,{
        first_name: Utilisateur.nom,
        last_name: Utilisateur.prenom,
        email: Utilisateur.email,
        password: Utilisateur.password
      },
      {
        headers : {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      },
    );
    messageVisible.value = true
    setTimeout(() => {
      router.push("/connexion");
    }, 3000);
    //console.log(response,"Compte créé")
    
  }
  catch (err :any)
  {
    messageVisible.value = false
    errorVisible.value = true
    //console.error("Impossible d'envoyer ce post", err)
    //Vu que j'utilise supabase je met cette condition en cas de spam
    if(err.response.status === 429){
        failedMessage.value = "Trop de tentatives. Veuillez patienter"
    }
  }
}


</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-200 px-4 py-8 sm:px-6">

    <div class="w-full max-w-xl bg-white shadow-xl text-black rounded-xl flex flex-col items-center text-center p-5 sm:p-6">
      
      

      <ul class="flex flex-wrap justify-center gap-2">
        <li class="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium sm:px-4 sm:text-sm">100% gratuit</li>
        <li class="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium sm:px-4 sm:text-sm">Sécurisé</li>
        <li class="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium sm:px-4 sm:text-sm">Sans publicité</li>
      </ul>

      <form
        @submit.prevent="submitForm"
        class="w-full bg-white py-6 rounded-xl flex flex-col gap-5 sm:px-4"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-2xl font-bold text-center text-gray-800">Créer votre compte</h2>
          <p class="text-sm text-gray-500">Suivez vos candidatures depuis un espace personnel.</p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="nom" class="text-sm font-medium text-gray-700 text-left">Nom</label>
            <input
                type="text"
                id="nom"
                v-model="Utilisateur.nom"
                placeholder="Entrez votre nom"
                required
                class="w-full min-h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>

          <div class="flex flex-col gap-1">
            <label for="prenom" class="text-sm font-medium text-gray-700 text-left">Prénom</label>
            <input
                type="text"
                id="prenom"
                v-model="Utilisateur.prenom"
                placeholder="Entrez votre prénom"
                required
                class="w-full min-h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>

          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm font-medium text-gray-700 text-left">Email</label>
            <input
                type="email"
                id="email"
                v-model="Utilisateur.email"
                placeholder="Entrez votre email"
                required
                class="w-full min-h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-medium text-gray-700 text-left">Mot de passe <span class="text-gray-400">(minimum 6 caractères)</span></label>
            <input
                type="password"
                id="password"
                v-model="Utilisateur.password"
                placeholder="********"
                required
                class="w-full min-h-12 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-purple-600 text-white min-h-12 px-4 rounded-lg hover:bg-purple-700 transition font-bold mt-2 active:scale-95"
        >
          Envoyer
        </button>

          <p v-if="messageVisible"
            class="text-sm font-medium text-center p-3 rounded-lg bg-purple-200 text-black"
          >
          {{ CreatingAccountMessage }}
          </p>
          <p v-if="errorVisible"
            class="text-sm font-medium text-center p-3 rounded-lg bg-red-200 text-black"
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
