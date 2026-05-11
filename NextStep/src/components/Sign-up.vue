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
const CreatingAccountMessage = 'Votre a été bien créé, vous allez etre ridirigé vers le formulaire de connexion'
const errorVisible = ref(false)
const failedMessage = "Respecté la longeur du mot de passe prévu"

const URL_REGISTER = import.meta.env.VITE_URL_REGISTER_API;


const submitForm = async (): Promise<void> => {
  try {
    messageVisible.value = true
    errorVisible.value = false
    const response = await axios.post(
      URL_REGISTER,{
        nom: Utilisateur.nom,
        prenom: Utilisateur.prenom,
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
    )
    //console.log("Compte créé")
    
  }
  catch (err)
  {
    messageVisible.value = false
    errorVisible.value = true
    console.error("Impossible d'envoyer ce post", err)
  }
}

function gotoConnexion(){
    router.push("/connexion")
  }

</script>

<template>
  <div class="min-h-screen flex flex-col items-center  bg-gray-200  pb-10 p-5">

    <div class="w-full max-w-xl p-6 bg-white shadow-xl text-black rounded-md flex flex-col items-center text-center">
      
      

      <ul class="flex flex-wrap justify-center gap-2">
        <li class="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">100% gratuit</li>
        <li class="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">Sécurisé</li>
        <li class="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">Sans publicité</li>
      </ul>

      <form
        @submit.prevent="submitForm"
        class="w-full bg-white p-8 rounded-xl  flex flex-col gap-4 m-2"
      >
        <h2 class="text-2xl font-bold text-center text-gray-800">Crée votre compte</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="nom" class="text-sm font-medium text-gray-700 text-left">Nom</label>
            <input
                type="text"
                id="nom"
                v-model="Utilisateur.nom"
                placeholder="Entrez votre nom"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm text-black"
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
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm text-black"
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
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 shadow-sm text-black"
              />
          </div>

          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-medium text-gray-700 text-left">Mot de passe(Minimun 6 caractère)</label>
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
         <p class="text-sm">Vous avez déjà un compte ? <button @click="gotoConnexion" class="text-purple-700 hover:underline">Connectez-vous</button></p>

         <p class="text-sm"><button @click="gotoConnexion" class="text-purple-700 hover:underline">Politique de confidentialité</button></p>


    </div>
  </div>

</template>