<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import { useDateFormat } from '@/composables/dateFormat'
import { useRouter } from 'vue-router'
const { formatApiDate } = useDateFormat()

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (authStore.user?.role !== 'admin') {
    router.push('/')
    return
  }
  await authStore.fetchUsers()
})

const utilisateurs = computed(() => {
  return authStore.CompteTuilisateur
    ? authStore.CompteTuilisateur.filter((C) => C.role === 'user')
    : []
})

const totalUtilisateurs = computed(() => utilisateurs.value.length)

const statsCards = computed(() => [
  {
    label: 'Total utilisateurs',
    value: totalUtilisateurs.value,
    icon: 'mdi-account-multiple',
    color: 'bg-purple-600',
  },
  {
    label: 'Utilisateurs actifs',
    value: utilisateurs.value.length,
    icon: 'mdi-check-circle',
    color: 'bg-purple-500',
  },
])

const handleLogout = () => {
  authStore.clearToken()
  router.push('/connexion')
}
</script>

<template>
  <main class="min-h-screen bg-gray-100 px-2 py-4 text-slate-800 sm:px-4 md:px-6 lg:px-8">
    <section class="mx-auto flex w-full flex-col gap-4 md:gap-6">
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="min-w-0">
            <p class="text-xs font-bold tracking-wide text-purple-600 uppercase md:text-sm">
              Administration
            </p>
            <h1 class="mt-1 text-lg font-bold text-slate-900 md:mt-2 md:text-xl lg:text-2xl">
              Bienvenue {{ authStore.user?.last_name || 'Admin' }}
            </h1>
            <p class="mt-1 text-xs text-slate-500 md:mt-2 md:text-sm">
              Espace administrateur NextStep.
            </p>
          </div>

          <button
            type="button"
            @click="handleLogout"
            class="min-h-10 w-full rounded-lg bg-purple-700 px-3 py-2 text-sm font-bold text-white shadow-md transition hover:bg-purple-800 active:scale-95 md:min-h-11 md:w-auto md:px-4 md:py-2.5"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        <div
          v-for="stat in statsCards"
          :key="stat.label"
          :class="['rounded-lg p-4 text-white shadow-sm md:p-5 lg:p-6', stat.color]"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold opacity-90 md:text-sm">{{ stat.label }}</p>
              <p class="mt-1 text-2xl font-bold md:mt-2 md:text-3xl lg:text-4xl">
                {{ stat.value }}
              </p>
            </div>
            <i :class="[stat.icon, 'mdi text-3xl opacity-20 md:text-4xl lg:text-5xl']"></i>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-1 md:gap-2">
        <p class="text-xs font-bold tracking-wide text-slate-500 uppercase md:text-sm">
          Utilisateurs
        </p>
        <h2 class="text-lg font-bold text-slate-900 md:text-xl lg:text-2xl">Gestion des comptes</h2>
      </div>

      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <div
          v-for="user in utilisateurs"
          :key="user.id"
          class="flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-lg"
        >
          <!-- Avatar circulaire -->
          <div class="mb-4 flex justify-center">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-md"
            >
              <span class="text-lg font-bold text-white">
                {{ user.first_name?.[0]?.toUpperCase() }}{{ user.last_name?.[0]?.toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Nom -->
          <h3 class="text-center text-sm font-semibold text-slate-900">
            {{ user.last_name }} {{ user.first_name }}
          </h3>

          <p class="mt-2 truncate text-center text-xs text-slate-500">{{ user.email }}</p>

          <div class="mt-4 space-y-2">
            <div class="flex items-center justify-center">
              <span
                class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
              >
                {{ user.role }}
              </span>
            </div>

            <p class="text-center text-xs text-slate-500">
              <i class="mdi mdi-calendar-outline mr-1"></i>
              {{ formatApiDate(user.created_at) }}
            </p>
          </div>
        </div>

        <div
          v-if="utilisateurs.length === 0"
          class="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-12"
        >
          <i class="mdi mdi-account-off mb-3 text-4xl text-slate-300"></i>
          <p class="text-sm text-slate-500">Aucun utilisateur</p>
        </div>
      </div>
    </section>
  </main>
</template>
