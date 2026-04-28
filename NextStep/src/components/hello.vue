<script setup lang="ts">
import { reactive } from 'vue';
import logo from "@/components/images/NextStep_logo.png";
defineProps<{
  title: string
  welcome: string
}>();

const Utilisateur = reactive({
  nom: '',
  prenom: '',
  email: '',
  password: ''
});

function submitForm(){
  console.log("Formulaire soumis :", Utilisateur);
  alert("Inscription réussie pour " + Utilisateur.prenom);
  console.log(Utilisateur);
}

</script>

<template>
  <div class="min-h-screen flex flex-col items-center pt-5 bg-gray-200 gap-8 pb-10 p-5">

    <div class="w-full max-w-xl p-6 bg-white shadow-xl text-black rounded-md flex flex-col items-center text-center">
      
      <div class="flex items-center gap-3 mb-2">
      <h2 class="text-2xl font-bold mb-2">{{ title }}</h2>
      <img :src='logo' class="h-30 w-auto" alt="NextStep_logo">
      </div>
      <p class="mt-2 mb-4">{{ welcome }}</p>

      <ul class="flex flex-wrap justify-center gap-2 p-4">
        <li class="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">100% gratuit</li>
        <li class="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">Sécurisé</li>
        <li class="px-4 py-1 bg-purple-500 text-white rounded-full text-sm">Sans publicité</li>
      </ul>

      <form
        @submit.prevent="submitForm"
        class="w-full bg-white p-8 rounded-xl shadow-2xl flex flex-col gap-4 m-2"
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
          Envoyer
        </button>

        <p class="text-sm">Vous avez déjà un compte ? <a href="#" class="text-purple-700 hover:underline">Connectez-vous</a></p>

      </form>

    </div>
  </div>

</template>