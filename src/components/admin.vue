<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import { useDateFormat } from '@/composables/dateFormat'
import { useRouter } from 'vue-router'
const { formatApiDate } = useDateFormat()

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.fetchUsers()
})

const utilisateurs = computed(() => {
  return authStore.CompteTuilisateur
    ? authStore.CompteTuilisateur.filter((C) => C.role === 'user')
    : []
})

const totalUtilisateurs = computed(() => utilisateurs.value.length)

const handleLogout = () => {
  authStore.clearToken()
  router.push('/connexion')
}
</script>

<template>
  <main class="min-h-screen bg-gray-200 px-4 py-6 text-slate-800 sm:px-6 md:p-8">
    <section class="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div class="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="min-w-0">
            <p class="text-sm font-bold tracking-wide text-purple-600 uppercase">Administration</p>
            <h1 class="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Bienvenue {{ authStore.user?.last_name || 'Admin' }}
            </h1>
            <p class="mt-2 text-sm text-slate-500">Espace administrateur NextStep.</p>
          </div>

          <button
            type="button"
            @click="handleLogout"
            class="min-h-12 w-full rounded-xl bg-purple-700 px-4 py-3 font-bold text-white shadow-md transition hover:bg-purple-800 active:scale-95 md:w-auto"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-bold tracking-wide text-slate-500 uppercase">Utilisateurs</p>
          <h2 class="text-xl font-bold text-slate-900 sm:text-2xl">Liste des utilisateurs</h2>
        </div>
        <p class="text-sm font-semibold text-purple-700">{{ totalUtilisateurs }} compte(s)</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div
          class="min-h-44 rounded-xl bg-purple-600 p-5 text-white shadow-sm"
          v-for="Compte in utilisateurs"
          :key="Compte.id"
        >
          <div class="flex h-full flex-col gap-3">
            <div class="min-w-0">
              <p class="text-xs font-bold tracking-wide text-purple-100 uppercase">Utilisateur</p>
              <h3 class="mt-1 text-lg font-bold break-words">
                {{ Compte.last_name }} {{ Compte.first_name }}
              </h3>
            </div>

            <div class="flex flex-col gap-2 text-sm text-purple-50">
              <p class="break-all">Email : {{ Compte.email }}</p>
              <p>Role : {{ Compte.role }}</p>
              <p>Créé le : {{ formatApiDate(Compte.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
