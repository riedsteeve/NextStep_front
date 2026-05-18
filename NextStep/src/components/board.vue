<script setup lang="ts">
import { reactive, ref } from 'vue';
import axios from 'axios';
import Notes from './notes.vue';
import { useAuthStore } from '@/stores/auth';
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

const selectedStatus = ref('')

const isModalOpen = ref(false)
const messageVisible = ref(false)
const message = ref('')
const errorVisible = ref(false)
const messageError =ref('Impossible de poster cette candidature ! veuillez vérifier vos différent champs')

const URL_APPLICATION = import.meta.env.VITE_APPLICATION_API;

const submitForm = async (): Promise<void> => {
  try {
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
          Accept: 'application/json'
        },
        withCredentials: true,
      },
    );
    messageVisible.value = true,
    console.log(response)
    message.value = 'Candidature bien enrégistré'
  }
  catch(err : any){
    messageVisible.value = false
    errorVisible.value = true

    console.error("Impossible d'envoyer ce post", err)
  }
  //isModalOpen.value = false
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
      <i class="fa-solid fa-circle-plus text-lg"></i>
      Nouvelle candidature
    </button>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl h-12 font-bold text-slate-900">Nouvelle Candidature</h3>
          <button 
            @click="isModalOpen = false" 
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col space-y-2 h-100 justify-between">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nom de l'entreprise</label>
            <input 
              v-model="candidature.company"
              type="text" 
              placeholder="Ex: Naval Group" 
              class="w-full h-12 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Poste</label>
            <input 
              v-model="candidature.position"
              type="text" 
              placeholder="Ex: Développeur Front-End" 
              class="w-full px-4 h-12 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select
                id="status"
                v-model="selectedStatus"
                class="w-full px-4 h-12 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium outline-none cursor-pointer appearance-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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
            <label class="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
            <input 
              v-model="candidature.notes"
              type="text" 
              placeholder="Ex: Entrez une desciption" 
              class="w-full px-4 h-12 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              required
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
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
            <p v-if="messageVisible" class="text-sm font-medium text-center p-3 rounded-lg bg-purple-200 text-black">
              {{ message }}
            </p>
            <p v-if="errorVisible" class="text-sm font-medium text-center p-3 rounded-lg bg-red-200 text-black">
              {{ messageError }}
            </p>
          </div>
        </form>

      </div>
    </div>


  </div>
</div>
</template>