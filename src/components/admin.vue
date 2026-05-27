<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted } from 'vue';
import { useDateFormat } from '@/composables/dateFormat';
import { useRouter } from 'vue-router';
const { formatApiDate } = useDateFormat()



const authStore = useAuthStore()
const router = useRouter()

onMounted(async() =>{
 await authStore.fetchUsers()
})

const utilisateurs = computed(() => {
  return authStore.CompteTuilisateur? authStore.CompteTuilisateur.filter(C => C.role === 'user'):[]
})

const totalUtilisateurs = computed(() => utilisateurs.value.length)

const handleLogout = () => {
  authStore.clearToken()
  router.push("/connexion")
}
</script>

<template>
  <main class="min-h-screen bg-gray-200 p-8 text-slate-800">
    <section class="mx-auto flex w-full flex-col gap-6">
      <div class="rounded-2xl bg-white p-6 w-full shadow-sm border border-slate-200">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-sm font-bold uppercase tracking-wide text-purple-600">Administration</p>
            <h1 class="mt-2 text-2xl font-bold text-slate-900">
              Bienvenue {{ authStore.user?.last_name || 'Admin' }}
            </h1>
            <p class="mt-2 text-sm text-slate-500">
              Espace administrateur NextStep.
            </p>
          </div>

          <button
            type="button"
            @click="handleLogout"
            class="w-full rounded-xl bg-purple-700 px-4 py-3 font-bold text-white shadow-md transition hover:bg-purple-800 active:scale-95 md:w-auto"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <h1 class="text-2xl">Liste des utilisateurs ({{ totalUtilisateurs }})</h1>
      <div class="flex gap-4">
        <div class="w-50 h-50 bg-purple-500 rounded-sm shadow-sm p-5 text-white"
          v-for="Compte in utilisateurs"
          :key="Compte.id"
        >
         <p>Prénom : {{ Compte.last_name }}</p>
         <p>Nom : {{ Compte.first_name }}</p>
         <p>Email : {{ Compte.email }}</p>
         <p>Role : {{ Compte.role }}</p>
         <p>Créé le : {{ formatApiDate(Compte.created_at) }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
