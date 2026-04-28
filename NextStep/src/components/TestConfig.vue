<template>
  <v-container class="mt-10">
    <v-card class="pa-6 mx-auto max-w-md shadow-2xl border-2 border-blue-500">
      <v-card-title class="text-3xl font-bold text-center text-purple-600">
        Vuetify + Tailwind 4
      </v-card-title>
      
      <v-card-text class="text-center mt-4">
        <p class="mb-4 text-gray-600 italic">
          Si ce texte est violet et en gras, Tailwind fonctionne.
        </p>
        
        <v-btn
          color="primary"
          class="hover:rotate-3 transition-transform duration-300 bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          Bouton Vuetify stylisé par Tailwind
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
</script>
