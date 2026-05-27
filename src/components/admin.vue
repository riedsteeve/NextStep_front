<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, onMounted } from 'vue';
import { useDateFormat } from '@/composables/dateFormat';
const { formatApiDate } = useDateFormat()



const authStore = useAuthStore()

onMounted(async() =>{
 await authStore.fetchUsers()
})

const utilisateurs = computed(() => {
  return authStore.CompteTuilisateur? authStore.CompteTuilisateur.filter(C => C.role === 'user'):[]
})

const totalUtilisateurs = computed(() => utilisateurs.value.length)
</script>

<template>
  <main class="min-h-screen bg-gray-200 p-8 text-slate-800">
    <section class="mx-auto flex w-full flex-col gap-6">
      <div class="rounded-2xl bg-white p-6 w-full shadow-sm border border-slate-200">
        <p class="text-sm font-bold uppercase tracking-wide text-purple-600">Administration</p>
        <h1 class="mt-2 text-2xl font-bold text-slate-900">
          Bienvenue {{ authStore.user?.last_name || 'Admin' }}
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Espace administrateur NextStep.
        </p>
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
