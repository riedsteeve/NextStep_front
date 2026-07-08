<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { useDateFormat } from '@/composables/dateFormat'
const { formatApiDate } = useDateFormat()
const authStore = useAuthStore()
const candidature = reactive({
  company: '',
  position: '',
  status: '',
  notes: '',
})

const statusOptions = [
  { value: 'en_cours', label: 'En cours', color: 'bg-amber-500' },
  { value: 'accepte', label: 'Accepté', color: 'bg-emerald-500' },
  { value: 'relance', label: 'Relancé', color: 'bg-purple-500' },
  { value: 'entretien', label: 'Entretien', color: 'bg-green-500' },
  { value: 'refuse', label: 'Refusé', color: 'bg-rose-500' },
]

const isModalOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const selectedCandidatureId = ref<number | string | null>(null)
const messageVisible = ref(false)
const message = ref('')
const errorVisible = ref(false)
const messageError = ref(
  'Impossible de poster cette candidature ! veuillez vérifier vos différent champs',
)

const URL_APPLICATION = import.meta.env.VITE_APPLICATION_API

//je charge la liste des candidatures
onMounted(async () => {
  try {
    await authStore.fetchCandidatures()
  } catch (error) {
    errorVisible.value = true
    message.value = 'Erreur lors du chargement des candidatures'
    //console.error("Erreur lors du chargement des candidatures", error)
  }
})

//calcule dynamique du nombre de candidature
const totalCandidatures = computed(() => authStore.candidatures.length)

//calcule des candidatures en attente
const candidatureEnAttente = computed(() => {
  return authStore.candidatures.filter((c) => c.status === 'en_cours').length
})
//les candidatures refusées
const totalRefuse = computed(() => {
  return authStore.candidatures.filter((c) => c.status === 'refuse').length
})
//les candidatures acceptées
const totalAccepte = computed(() => {
  return authStore.candidatures.filter((c) => c.status === 'accepte').length
})

const resetForm = () => {
  candidature.company = ''
  candidature.position = ''
  candidature.status = ''
  candidature.notes = ''
  selectedCandidatureId.value = null
}

const openCreateModal = () => {
  formMode.value = 'create'
  resetForm()
  messageVisible.value = false
  errorVisible.value = false
  isModalOpen.value = true
}

const openEditModal = (candid: any) => {
  formMode.value = 'edit'
  selectedCandidatureId.value = candid.id
  candidature.company = candid.company
  candidature.position = candid.position
  candidature.status = candid.status
  candidature.notes = candid.notes || ''
  messageVisible.value = false
  errorVisible.value = false
  isModalOpen.value = true
}

const deleteCandid = async (id: number) => {
  try {
    if (confirm('Voulez vous vraiment supprimer cette candidatures ?') == true) {
      await authStore.deleteCandidatures(id)
      return (message.value = 'Candidature supprimer!')
    } else {
      return
    }
  } catch (error: any) {
    console.error('Erreur lors de la supression ! :', error)
  }
}

const submitForm = async (): Promise<void> => {
  try {
    //je récupere le token si non sans ca pas de post de candidature
    const token = authStore.token

    messageVisible.value = false
    errorVisible.value = false

    const payload = {
      company: candidature.company,
      position: candidature.position,
      status: candidature.status,
      notes: candidature.notes,
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }

    if (formMode.value === 'edit' && selectedCandidatureId.value) {
      await axios.put(`${URL_APPLICATION}/${selectedCandidatureId.value}`, payload, config)
      message.value = 'Candidature bien modifiée !'
    } else {
      await axios.post(URL_APPLICATION, payload, config)
      message.value = 'Candidature bien enregistrée !'
    }

    messageVisible.value = true
    resetForm()

    //je rafraichit ensuite la listeb de candidatures pour une incrémentaion dynamique
    await authStore.fetchCandidatures()

    setTimeout(() => {
      isModalOpen.value = false
      messageVisible.value = false
    })
  } catch (err: any) {
    messageVisible.value = false
    errorVisible.value = true

    if (err.response && err.response.status === 401) {
      authStore.clearToken()
      setTimeout(() => {
        isModalOpen.value = false
        messageVisible.value = false
        alert((message.value = 'votre session a expiré'))
      })
      router.push('/connexion')
      return
    }

    console.error("Impossible d'envoyer ce post", err)
    //console.error(err.response?.data?.message)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <h1 class="mb-4 text-xl font-bold md:text-2xl">Mon Suivi de Candidatures</h1>
      <p>Bienvenue sur votre espace de suivi NextStep.</p>
    </div>

    <div class="w-full md:w-auto">
      <button
        type="button"
        class="hover w-full rounded-2xl bg-purple-700 p-4 text-white shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl active:scale-95 md:w-auto"
        @click="openCreateModal"
      >
        <i class="mdi mdi-file-plus-outline mr-2 text-xl" style="color: white"></i>
        Nouvelle candidature
      </button>

      <div
        id="appModal"
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      >
        <div
          class="animate-in fade-in zoom-in-95 max-h-full w-full max-w-lg overflow-y-auto rounded border border-slate-100 bg-white p-5 shadow-2xl duration-200 md:p-8"
        >
          <div class="mb-6 flex items-center justify-between">
            <h3 class="min-h-12 text-lg font-bold text-slate-900 md:text-xl">
              {{ formMode === 'create' ? 'Nouvelle Candidature' : 'Modifier Candidature' }}
            </h3>
            <button
              @click="isModalOpen = false"
              class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <p class="font-bold" style="color: rgb(177, 151, 252)">X</p>
            </button>
          </div>

          <div class="mb-4">
            <p
              v-if="messageVisible"
              class="rounded-xl border border-emerald-200 bg-emerald-100 p-3 text-center text-sm font-medium text-emerald-800"
            >
              {{ message }}
            </p>
            <p
              v-if="errorVisible"
              class="rounded-xl border border-rose-200 bg-rose-100 p-3 text-center text-sm font-medium text-rose-800"
            >
              {{ messageError }}
            </p>
          </div>

          <form @submit.prevent="submitForm" class="flex flex-col gap-5">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700"
                >Nom de l'entreprise</label
              >
              <input
                v-model="candidature.company"
                type="text"
                placeholder="Ex: Naval Group"
                class="h-12 w-full rounded border-2 border-slate-400 px-4 py-2 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Poste</label>
              <input
                v-model="candidature.position"
                type="text"
                placeholder="Ex: Développeur Front-End"
                class="h-12 w-full rounded border-2 border-slate-400 px-4 py-2 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                required
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Status</label>
              <select
                id="status"
                v-model="candidature.status"
                class="h-12 w-full cursor-pointer appearance-none rounded border-2 border-slate-400 bg-white px-4 py-2 font-medium text-slate-700 transition-all outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="" disabled>Choisir un statut</option>

                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
              <textarea
                v-model="candidature.notes"
                placeholder="Ex: Entrez une desciption"
                class="h-12 w-full rounded border-2 border-slate-400 px-4 py-2 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                rows="5"
                cols="33"
              >
              </textarea>
            </div>

            <div class="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                @click="isModalOpen = false"
                class="rounded-xl bg-red-400 px-4 py-2 font-medium text-black transition-colors hover:bg-red-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="rounded-xl bg-purple-700 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-purple-800"
              >
                {{ formMode === 'create' ? 'Enregistrer' : 'Modifier' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-8 xl:grid-cols-4">
    <p v-if="errorVisible">
      {{ message }}
    </p>

    <div
      class="group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border-2 border-purple-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-black tracking-wide text-purple-900 uppercase">
          Total Candidatures
        </h2>
        <i class="mdi mdi-view-grid text-2xl text-purple-400"></i>
      </div>
      <p class="text-4xl font-black text-purple-700">{{ totalCandidatures }}</p>
    </div>

    <div
      class="group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border-2 border-amber-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-black tracking-wide text-amber-600 uppercase">En cours</h2>
        <i class="mdi mdi-clock-outline text-2xl text-amber-400"></i>
      </div>
      <p class="text-4xl font-black text-amber-500">{{ candidatureEnAttente }}</p>
    </div>

    <div
      class="group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border-2 border-rose-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-black tracking-wide text-rose-600 uppercase">Refusé</h2>
        <i class="mdi mdi-close-circle-outline text-2xl text-rose-400"></i>
      </div>
      <p class="text-4xl font-black text-rose-500">{{ totalRefuse }}</p>
    </div>

    <div
      class="group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-black tracking-wide text-emerald-600 uppercase">Accepté</h2>
        <i class="mdi mdi-check-circle-outline text-2xl text-emerald-400"></i>
      </div>
      <p class="text-4xl font-black text-emerald-500">{{ totalAccepte }}</p>
    </div>
  </div>

  <!---Le Tableau--->
  <div class="p-4 md:p-8">
    <div class="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table class="w-full min-w-[820px] border-collapse text-left" id="appsTable">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50 font-semibold text-slate-400">
            <th class="px-4 py-4 text-[13px] tracking-[0.15em] uppercase md:px-6">Entreprise</th>
            <th class="px-4 py-4 text-[13px] tracking-[0.15em] uppercase md:px-6">Poste</th>
            <th class="px-4 py-4 text-[13px] tracking-[0.15em] uppercase md:px-6">Statut</th>
            <th class="px-4 py-4 text-[13px] tracking-[0.15em] uppercase md:px-6">Notes & Suivi</th>
            <th class="px-4 py-4 text-[13px] tracking-[0.15em] uppercase md:px-6">Dates</th>
            <th class="px-4 py-4 text-right text-[13px] tracking-[0.15em] uppercase md:px-6">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="candid in authStore.candidatures"
            :key="candid.id"
            class="transition-colors hover:bg-slate-50"
          >
            <td class="px-4 py-4 font-bold text-slate-900 md:px-6">
              {{ candid.company }}
            </td>

            <td class="px-4 py-4 font-medium text-slate-600 md:px-6">
              {{ candid.position }}
            </td>

            <td class="px-4 py-4 md:px-6">
              <span
                class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 uppercase"
                :class="{
                  'bg-emerald-100 text-emerald-800': candid.status === 'accepte',
                  'bg-amber-100 text-amber-800': candid.status === 'en_cours',
                  'bg-rose-100 text-rose-800': candid.status === 'refuse',
                }"
              >
                {{ candid.status }}
              </span>
            </td>

            <td class="max-w-xs truncate px-4 py-4 text-sm text-slate-500 md:px-6">
              {{ candid.notes || 'Aucune note' }}
            </td>

            <td class="max-w-xs truncate px-4 py-4 text-sm text-slate-500 md:px-6">
              <p v-if="candid.updated_at && candid.updated_at !== candid.created_at">
                Modifié le : {{ formatApiDate(candid.updated_at) }}
              </p>
              <p v-else>Créé le : {{ formatApiDate(candid.created_at) }}</p>
            </td>

            <td class="px-4 py-4 text-right md:px-6">
              <div class="flex items-center justify-end gap-3">
                <button
                  @click="openEditModal(candid)"
                  type="button"
                  class="group w-10 rounded-xl bg-amber-100 p-2 transition-colors hover:bg-amber-200"
                  title="Modifier la candidature"
                >
                  <i class="mdi mdi-pen text-sm text-amber-400"></i>
                </button>

                <button
                  @click="deleteCandid(candid.id)"
                  type="button"
                  class="group w-10 rounded-xl bg-rose-100 p-2 text-rose-600 transition-colors hover:bg-rose-200"
                  title="Supprimer la candidature"
                >
                  <i class="mdi mdi-trash-can text-sm text-red-600"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="authStore.candidatures.length === 0">
            <td colspan="5" class="px-4 py-10 text-center text-slate-400 italic md:px-6">
              Aucune candidature pour le moment.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
