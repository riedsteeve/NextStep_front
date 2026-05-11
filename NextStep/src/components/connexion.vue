<script setup lang="ts">
import { reactive } from 'vue';
import { ref } from 'vue';

const Utilisateur = reactive({
  email: '',
  password: ''
});

const messageVisible = ref(false)
const CreatingAccountMessage = 'Votre a été bien créé, vous allez etre ridirigé vers le formulaire de connexion'
const errorVisible = ref(false)
const failedMessage = "Respecté la longeur du mot de passe prévu"

function submitForm(){

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
      </form>

    </div>
  </div>

</template>