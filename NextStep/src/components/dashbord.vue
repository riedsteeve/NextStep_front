<script setup lang="ts">
import logo from '@/components/images/NextStep_logo.png'
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore()

const menuItems = [
  { to: '/board', label: 'Tableau de bord', icon: 'fa-house' },
  { to: '/notes', label: 'Notes', icon: 'fa-gear' },
]

//On vérifie si l'utilisateur est connecté

</script>


<template>
  <div class="flex h-screen bg-gray-200 text-slate-800 font-sans overflow-hidden">
    
    <nav class="w-64 bg-white border-r border-slate-200 shadow-xl flex flex-col h-full">
      
      <div class="p-6 text-center">
        <img :src="logo" class="h-20 mx-auto object-contain" alt="Logo NextStep">
        <h2 class="text-gray-400 font-black text-[11px] uppercase tracking-wider mt-4">
          Menu principal
        </h2>
      </div>

      <div class="px-4 space-y-2 flex-1">
        <RouterLink 
          v-for="item in menuItems" 
          :key="item.to"
          :to="item.to" 
          class="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200"
          active-class="bg-purple-200 text-purple-900 font-semibold"
        >
          <i class="fa-solid text-lg w-5 text-center" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>

      <p>Hello {{ authStore.user.nom }}</p>

    </nav>

    <main class="flex-1 overflow-y-auto p-8">
      <RouterView />
    </main>

  </div>
</template>



<style>

</style>