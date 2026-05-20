<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import Notes from './notes.vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
const authStore = useAuthStore()
const candidature = reactive({
  company: '',
  position: '',
  status: '',
  notes: ''
});


const statusOptions = [
  { value: 'en_cours', label: 'En cours', color: 'bg-amber-500' },
  { value: 'accepte', label: 'Accepté', color: 'bg-emerald-500' },
  { value: 'refuse', label: 'Refusé', color: 'bg-rose-500' }
]

const isModalOpen = ref(false)
const messageVisible = ref(false)
const message = ref('')
const errorVisible = ref(false)
const messageError =ref('Impossible de poster cette candidature ! veuillez vérifier vos différent champs')

const URL_APPLICATION = import.meta.env.VITE_APPLICATION_API;

//je charge la liste des candidatures
onMounted(async () => {
  try{
    await authStore.fetchCandidatures()
  }catch(error){
    errorVisible.value = true
    message.value = "Erreur lors du chargement des candidatures"
    //console.error("Erreur lors du chargement des candidatures", error)
  }
})

//calcule dynamique du nombre de candidature
const totalCandidatures = computed(() => authStore.candidatures.length)

//calcule des candidatures en attente
const candidatureEnAttente = computed(() => {
  return authStore.candidatures.filter(c => c.status === 'en_cours').length
})
//les candidatures refusées
const totalRefuse = computed(() => {
  return authStore.candidatures.filter(c => c.status === "refuse").length
})
//les candidatures acceptées
const totalAccepte = computed(() => {
  return authStore.candidatures.filter(c => c.status === "accepte").length
})

const candidatureCompletes = authStore.candidatures


const submitForm = async (): Promise<void> => {
  try {
    //je récupere le token si non sans ca pas de post de candidature
    const token = authStore.token

    messageVisible.value = false
    errorVisible.value = false
    const response = await axios.post(
      URL_APPLICATION,{
        company: candidature.company,
        position: candidature.position,
        status: candidature.status,
        notes: candidature.notes
      },
      {
        headers : {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      },
    );
    messageVisible.value = true,
    message.value = "Candidature bien enrégistré !"
    candidature.company = ''
    candidature.position = ''
    candidature.status = ''
    candidature.notes = ''

    //je rafraichit ensuite la listeb de candidatures pour une incrémentaion dynamique
    await authStore.fetchCandidatures()

    setTimeout(() => {
      isModalOpen.value = false
      messageVisible.value = false
    }, 1500);

  }
  catch(err : any){
    messageVisible.value = false
    errorVisible.value = true

  if(err.response && err.response.status === 401){
    authStore.clearToken()
    setTimeout(() => {
      isModalOpen.value = false
      messageVisible.value = false
     alert (message.value = 'votre session a expiré')
    }, 1500);
    router.push("/connexion")
  return
}

    console.error("Impossible d'envoyer ce post", err)
    //console.error(err.response?.data?.message)
  }
}



</script>

<template>
<div class="flex justify-between">
  <div>
    <h1 class="text-2xl font-bold mb-4">Mon Suivi de Candidatures</h1>
    <p>Bienvenue sur votre espace de suivi NextStep.</p>
  </div>

  <div>
    <button type="button" class="bg-purple-700 p-4 rounded-2xl
     text-white shadow-xl hover transition-all 
     duration-300 ease-out hover:-translate-y-1 
     hover:scale-[1.02] hover:shadow-xl active:scale-95"
     @click="isModalOpen = true">
      <i class="mdi mdi-file-plus-outline mr-2 text-xl" style="color:white;"></i>
      Nouvelle candidature
    </button>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div class="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl h-12 font-bold text-slate-900">Nouvelle Candidature</h3>
          <button 
            @click="isModalOpen = false" 
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <p class="font-bold" style="color: rgb(177, 151, 252);">X</p>
          </button>
        </div>

        <div class="mb-4">
          <p v-if="messageVisible" class="text-sm font-medium text-center p-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
            {{ message }}
          </p>
          <p v-if="errorVisible" class="text-sm font-medium text-center p-3 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
            {{ messageError }}
          </p>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col gap-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Nom de l'entreprise</label>
            <input 
              v-model="candidature.company"
              type="text" 
              placeholder="Ex: Naval Group" 
              class="w-full h-12 px-4 py-2 border-2 border-slate-400 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Poste</label>
            <input 
              v-model="candidature.position"
              type="text" 
              placeholder="Ex: Développeur Front-End" 
              class="w-full px-4 h-12 py-2 border-2 border-slate-400 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
                id="status"
                v-model="candidature.status"
                class="w-full px-4 h-12 py-2 bg-white border-2 border-slate-400 rounded-xl text-slate-700 font-medium outline-none cursor-pointer appearance-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            >
              <option value="" disabled selected>Choisir un statut</option>
            
                <option 
                  v-for="option in statusOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
            <input 
              v-model="candidature.notes"
              type="text" 
              placeholder="Ex: Entrez une desciption" 
              class="w-full px-4 h-12 py-2 border-2 border-slate-400 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              @click="isModalOpen = false" 
              class="px-4 py-2 rounded-xl bg-red-400 text-black hover:bg-red-100 font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-medium transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        </form>


      </div>
    </div>
  </div>

  

</div>

<div class="flex justify-evenly gap-12 p-8">

    <p v-if="errorVisible">
      {{ message }}
    </p>

    <div class="w-1/4 h-32 bg-white border-2 border-purple-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center">
      <h2 class="text-purple-900 text-sm font-black uppercase tracking-wide">Total Candidatures</h2>
      <i class="mdi mdi-view-grid text-purple-400 text-2xl"></i>
    </div>
    <p class="text-4xl font-black text-purple-700">{{ totalCandidatures }}</p>
  </div>

  <div class="w-1/4 h-32 bg-white border-2 border-amber-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center">
      <h2 class="text-amber-600 text-sm font-black uppercase tracking-wide">En cours</h2>
      <i class="mdi mdi-clock-outline text-amber-400 text-2xl"></i>
    </div>
    <p class="text-4xl font-black text-amber-500">{{ candidatureEnAttente }}</p>
  </div>

  <div class="w-1/4 h-32 bg-white border-2 border-rose-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center">
      <h2 class="text-rose-600 text-sm font-black uppercase tracking-wide">Refusé</h2>
      <i class="mdi mdi-close-circle-outline text-rose-400 text-2xl"></i>
    </div>
    <p class="text-4xl font-black text-rose-500">{{ totalRefuse }}</p>
  </div>

  <div class="w-1/4 h-32 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
    <div class="flex justify-between items-center">
      <h2 class="text-emerald-600 text-sm font-black uppercase tracking-wide">Accepté</h2>
      <i class="mdi mdi-check-circle-outline text-emerald-400 text-2xl"></i>
    </div>
    <p class="text-4xl font-black text-emerald-500">{{ totalAccepte }}</p>
  </div>
    
</div>


<!---Le Tableau--->
<div class="p-8">
<div class="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
  
  <table class="w-full text-left border-collapse" id="appsTable">
    
    <thead>
      <tr class="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold">
        <th class="px-6 py-4 text-[13px] uppercase tracking-[0.15em]">Entreprise</th>
        <th class="px-6 py-4 text-[13px] uppercase tracking-[0.15em]">Poste</th>
        <th class="px-6 py-4 text-[13px] uppercase tracking-[0.15em]">Statut</th>
        <th class="px-6 py-4 text-[13px] uppercase tracking-[0.15em]">Notes & Suivi</th>
        <th class="px-6 py-4 text-[13px] uppercase tracking-[0.15em] text-right">Actions</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-slate-100">
      <tr 
        v-for="candid in authStore.candidatures" 
        :key="candid.id"
        class="hover:bg-slate-50 transition-colors"
      >
        <td class="px-6 py-4 font-bold text-slate-900">
          {{ candid.company }}
        </td>

        <td class="px-6 py-4 text-slate-600 font-medium">
          {{ candid.position }}
        </td>

        <td class="px-6 py-4">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 uppercase"
          :class="{
            'bg-emerald-100 text-emerald-800': candid.status === 'accepte',
            'bg-amber-100 text-amber-800': candid.status === 'en_cours',
            'bg-rose-100 text-rose-800': candid.status === 'refuse'
          }"
          >
            {{ candid.status }}
          </span>
        </td>

        <td class="px-6 py-4 text-slate-500 text-sm max-w-xs truncate">
          {{ candid.notes || 'Aucune note' }}
        </td>

        
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-3">
    
            <button 
              class="bg-amber-100 w-10 hover:bg-amber-200 text-purple-700 p-2 rounded-xl transition-colors group"
              title="Modifier la candidature"
            >
              <i class="mdi mdi-pen text-amber-400 text-sm"></i>
            </button>
    
            <button 
               class="bg-rose-100 w-10 hover:bg-rose-200 text-rose-600 p-2 rounded-xl transition-colors group"
              title="Supprimer la candidature"
            >
            <i class="mdi mdi-trash-can text-red-600 text-sm"></i>
            </button>

          </div>
        </td>


      </tr>

      <tr v-if="authStore.candidatures.length === 0">
        <td colspan="5" class="px-6 py-10 text-center text-slate-400 italic">
          Aucune candidature pour le moment.
        </td>
      </tr>
    </tbody>

  </table>
</div>
</div>

</template>
