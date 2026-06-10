<script setup lang="ts">
import { RouterLink } from 'vue-router'
import logo from '@/components/images/NextStep_logo.png'
</script>

<template>
  <main
    class="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6 py-12 text-black"
  >
    <section class="flex w-full max-w-2xl flex-col items-center justify-center text-center">
      <div class="flex w-full justify-center">
        <img :src="logo" class="logo" alt="Logo NextStep" />
      </div>

      <div class="mt-4 flex w-full flex-col items-center gap-8">
        <span
          class="rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold tracking-wide text-purple-700 uppercase"
        >
          Carnet de bord numérique pour tes candidatures
        </span>

        <div class="w-full space-y-4">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Bienvenue sur <span class="text-purple-600">NextStep</span>
          </h1>

          <div class="flex items-center justify-center gap-4 text-gray-400">
            <div class="h-px w-12 bg-gray-300"></div>
            <h2 class="text-sm font-bold tracking-widest uppercase">NextStep c'est quoi ?</h2>
            <div class="h-px w-12 bg-gray-300"></div>
          </div>
        </div>

        <p class="max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
          NextStep, c'est ton
          <span class="font-semibold text-gray-900">carnet de bord numérique</span>. Note chaque
          entreprise où tu postules, garde un œil sur tes rendez-vous et prépare tes entretiens sans
          rien oublier.
        </p>

        <div class="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row sm:justify-center">
          <RouterLink
            to="/sign"
            class="flex h-12 w-full items-center justify-center rounded-lg bg-purple-600 font-bold text-white transition-all hover:bg-purple-700 active:scale-95"
          >
            Créer un compte
          </RouterLink>

          <RouterLink
            to="/connexion"
            class="flex h-12 w-full items-center justify-center rounded-lg border-2 border-gray-300 font-bold text-gray-700 transition-all hover:border-purple-600 hover:text-purple-600 active:scale-95"
          >
            Se connecter
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.logo {
  height: auto;
  width: auto;
  max-width: 100%;
  display: block;
  margin-bottom: -15%;
  margin-top: -20%;
}
</style>
