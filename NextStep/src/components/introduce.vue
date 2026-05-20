<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logo from '@/components/images/NextStep_logo.png'
</script>


<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-gray-200 px-5 py-8 text-black">
    <section class="flex w-full max-w-3xl flex-col items-center justify-center text-center">
      <img :src="logo" class="logo" alt="Logo NextStep">

      <div class="flex max-w-3xl flex-col items-center gap-4 sm:-mt-12">
        <p class="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
          Carnet de bord numérique pour tes candidatures
        </p>

        <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
          Bienvenue sur NextStep
        </h1>

        <div class="max-w-2xl space-y-3 text-base leading-7 text-gray-700 sm:text-lg">
          <h2 class="text-2xl font-semibold text-gray-900">
            NextStep c'est quoi ?
          </h2>
          <p>
            NextStep, c'est ton carnet de bord numérique. Note chaque entreprise où tu postules,
            garde un œil sur tes rendez-vous et prépare tes entretiens sans rien oublier.
          </p>
        </div>

        <div class="mt-3 flex flex-col gap-3 sm:flex-row">
           <RouterLink
            to="/sign"
            class="rounded-md bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700"
          >
            Créer un compte
          </RouterLink>

          <RouterLink
            to="/connexion"
            class="rounded-md border-2 border-purple-600 px-6 py-3 font-bold text-purple-700 transition hover:bg-purple-50"
          >
            Se connecter
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>


<style>
.logo{
  height: auto;
  width: auto;
  margin-bottom: -15%;
  margin-top: -20%;
}
</style>