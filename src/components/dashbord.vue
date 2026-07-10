<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  { to: '/board', label: 'Tableau de bord', icon: 'fa-house' },
  { to: '/notes', label: 'Notes', icon: 'fa-note-sticky' },
]

const handleLogout = () => {
  authStore.clearToken()
  router.push('/connexion')
}
const isMobileMenuOpen = ref(false)

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const getDate = () => {
  return new Date().toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-200 font-sans text-slate-800">
    <button
      v-if="!isMobileMenuOpen"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
      class="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-purple-700 shadow-md transition-colors hover:bg-purple-50 md:hidden"
    >
      <i class="mdi mdi-menu text-2xl"></i>
    </button>

    <div
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
    ></div>

    <nav
      :class="[
        'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out md:static',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="flex h-20 w-full items-center justify-start gap-4 bg-purple-700 p-8">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full border border-purple-300 bg-purple-100 shadow-2xl"
        >
          <i class="fa-solid fa-user text-purple-500"></i>
        </div>
        <p v-if="authStore.user" class="truncate font-medium text-white">
          Hello, {{ authStore.user.last_name }}
        </p>
        <p v-else class="animate-pulse text-sm text-purple-200">Chargement...</p>
      </div>

      <div class="p-6 text-center">
        <h2 class="mt-2 text-[13px] font-black tracking-wider text-gray-400 uppercase">
          Menu principal
        </h2>
      </div>

      <div class="flex-1 space-y-2 px-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          @click="closeMobileMenu"
          class="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-600 transition-colors duration-200 hover:bg-purple-100 hover:text-purple-700"
          active-class="bg-purple-200 text-purple-900 font-semibold"
        >
          <i class="fa-solid w-5 text-center text-lg" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="flex flex-col items-center p-4 text-center">
        <span class="mb-1 text-xs font-semibold tracking-wider text-purple-800 uppercase">
          - Nouvelles mise à jour -
        </span>
        <br />
        <ul class="list-inside list-disc text-xs leading-tight font-medium text-purple-800">
          <li>
            Champ contact pour renseigner le contact et le type de contact assigné à la candidature.
          </li>
        </ul>
      </div>

      <div class="border-t border-slate-100">
        <div class="bg-gray-100 p-3">
          <button
            @click="handleLogout"
            type="button"
            class="group flex h-12 w-full items-center justify-start gap-4 rounded-2xl border-purple-300 bg-purple-700 p-3 text-left shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-purple-800 hover:shadow-xl active:scale-95"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full border border-purple-300 bg-purple-100 shadow-sm transition-transform group-hover:scale-105"
            >
              <i
                class="mdi mdi-18px mdi-arrow-left-bold-hexagon-outline"
                style="color: rgb(177, 151, 252)"
              ></i>
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-white">Déconnexion</span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <div class="flex h-full flex-1 flex-col overflow-hidden">
      <div
        class="flex h-20 w-full flex-shrink-0 items-center justify-end border-b border-slate-200 bg-white px-4 pl-24 md:px-8"
      >
        <p class="font-medium text-slate-600">{{ getDate() }}</p>
      </div>

      <main class="flex-1 overflow-y-auto p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
