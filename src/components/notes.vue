<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDateFormat } from '@/composables/dateFormat';
const { formatApiDate } = useDateFormat()

interface Note{
  id: number,
  title: string,
  content: string,
  date: string
}

const authStore = useAuthStore()
const notes = computed(() => authStore.notes)

//je charge la liste des notes
onMounted(async () => {
  try{
    await authStore.fetchNotes()
  }catch(error){
    console.error("Erreur lors du chargement des notes", error)
  }
})

//Ajouter une nouvelle note
const createNewNote = async () => {
  const newNote = {
    title: '',
    content: '',
    date: new Date().toLocaleDateString('fr-FR', {
      day:'numeric',
      month:'short',
      hour:'2-digit',
      minute:'2-digit'
    })
  }

  await authStore.addNotes(newNote)
} 

//Mise a jour en temps reel 
const UpdateNote = async (id: number, field:'title' | 'content', event: Event) => {
  const target = event.target as HTMLElement
  const note = notes.value.find((n: Note) => n.id === id)
  if(note){
    const updateNote = {
      title: note.title,
      content: note.content,
      date: note.date,
      [field]: target.innerText
    }

    await authStore.UpdateNotes(id, updateNote)
  }
}

//Supression
const deleteNotes = async (id: number) => {
  await authStore.deleteNotes(id)
}
</script>

<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 class="text-xl md:text-2xl font-bold mb-2">Mes Notes & Mémos</h1>
        <p class="text-slate-500 text-sm">Garde sous le coude tes idées de candidatures, contacts clés ou checklists.</p>
      </div>

      <div class="w-full md:w-auto">
        <button 
          type="button" 
          class="bg-purple-700 p-4 rounded-2xl text-white shadow-xl hover:bg-purple-800 transition-all w-full md:w-auto duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] active:scale-95 flex items-center justify-center font-semibold"
          @click="createNewNote"
        >
          <i class="mdi mdi-file-plus-outline mr-2 text-xl text-white"></i>
          Nouveau Mémo
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      
      <div 
        v-for="note in notes" 
        :key="note.id"
        class="bg-amber-50 border border-amber-200 rounded-2xl 
        p-5 shadow-sm hover:shadow-md transition-all flex flex-col 
        justify-between min-h-[200px] group relative focus-within:ring-2
        focus-within:ring-amber-400 focus-within:border-transparent"
      >
      <div>
        <button 
          @click="deleteNotes(note.id)"
          class="absolute top-3 right-3 text-amber-600 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-200 transition-colors z-10"
          title="Supprimer"
        >
          <i class="mdi mdi-trash-can text-lg"></i>
        </button>

        <h3 
          contenteditable="true"
          @blur="UpdateNote(note.id, 'title', $event)"
          class="font-bold text-amber-950 text-lg outline-none pr-6 mb-2 empty:before:content-['Ajouter_un_titre...'] empty:before:text-amber-700/40 empty:before:font-normal break-words"
        >{{ note.title }}</h3>

        <p 
          contenteditable="true"
          @blur="UpdateNote(note.id, 'content', $event)"
          class="text-amber-900 text-sm outline-none leading-relaxed min-h-[60px] empty:before:content-['Ajouter_le_corps_de_la_note...'] empty:before:text-amber-700/40 break-words whitespace-pre-wrap"
        >{{ note.content }}</p>
      </div>

      <div class="mt-4 flex items-center justify-between text-[11px] font-bold text-amber-600 uppercase tracking-wide border-t border-amber-200/60 pt-3">
        <span class="flex items-center gap-1">
          <i class="mdi mdi-clock-outline"></i>
          <p v-if="note.updated_at && note.updated_at !== note.created_at">
            {{ formatApiDate(note.updated_at) }}
          </p>
          <p v-else>
            {{ formatApiDate(note.created_at) }}
          </p>
        </span>
        <span class="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded text-[9px]">Edit</span>
      </div>

      </div>
    </div>

    <div v-if="notes.length === 0" class="text-center py-20 text-slate-400 border-2 border-dashed border-slate-300 rounded-3xl">
      <i class="mdi mdi-note-plus-outline text-5xl text-slate-300 block mb-2"></i>
      <p class="font-medium text-slate-500">Aucun mémo pour le moment</p>
    </div>
  </section>
</template>

