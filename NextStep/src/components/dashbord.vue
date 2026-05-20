<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const router = useRouter() 

const menuItems = [
  { to: '/board', label: 'Tableau de bord', icon: 'fa-house' },
  { to: '/notes', label: 'Notes', icon: 'fa-note-sticky' },
]

const handleLogout = () => {
    authStore.clearToken()
    router.push("/connexion")
  } 

</script>

<template>
  <div class="flex h-screen bg-gray-200 text-slate-800 font-sans overflow-hidden">
  
    <nav class="w-64 bg-white border-r border-slate-200 shadow-xl flex flex-col h-full flex-shrink-0">
      
      <div class="flex p-8 w-full bg-purple-700 h-20 justify-start gap-4 items-center">
        <div class="flex items-center justify-center h-10 w-10 bg-purple-100 rounded-full border shadow-2xl border-purple-300">
          <i class="fa-solid fa-user text-purple-500"></i>
        </div>
        <p v-if="authStore.user" class="text-white font-medium truncate">
          Hello, {{ authStore.user.last_name }}
        </p>
        <p v-else class="text-purple-200 text-sm animate-pulse">Chargement...</p>
      </div>

      <div class="p-6 text-center">
        <h2 class="text-gray-400 font-black text-[13px] uppercase tracking-wider mt-2">
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

      <div class="border-t border-slate-100">
        <div class="bg-gray-100 p-3 ">
          <button 
            @click="handleLogout"
            type="button"
            class="flex p-3 w-full bg-purple-700 hover:bg-purple-800 transition-all duration-300 ease-out h-12 justify-start gap-4 items-center rounded-2xl shadow-md group text-left border-purple-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl active:scale-95"
          >
            <div class="flex items-center justify-center h-8 w-8 bg-purple-100 rounded-full border shadow-sm border-purple-300 group-hover:scale-105 transition-transform">
              <i class="mdi mdi-18px mdi-arrow-left-bold-hexagon-outline" style="color: rgb(177, 151, 252);"></i>          
            </div>
            <div class="flex flex-col">
              <span class="text-white font-bold text-sm">Déconnexion</span>
            </div>
          </button>
        </div>
      </div>

    </nav>

    <div class="flex-1 flex flex-col h-full overflow-hidden">
      
      <div class="w-full bg-white h-20 border-b border-slate-200 px-8 flex items-center flex-shrink-0">
        <div class="relative w-full max-w-md">
          <i class="mdi mdi-magnify absolute left-4 top-3.5 text-slate-400"></i>
          <input 
            type="search" 
            placeholder="Recherchez une entreprise, un poste..." 
            class="w-full bg-slate-100 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:bg-white border border-transparent focus:border-purple-500 transition-all"
          >
        </div>
      </div>

      <main class="flex-1 overflow-y-auto p-8">
        <RouterView />
      </main>

    </div>

  </div>
</template>
