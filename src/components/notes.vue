<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDateFormat } from '@/composables/dateFormat'
const { formatApiDate } = useDateFormat()

const authStore = useAuthStore()

// Système de couleurs prédéfinies avec IDs
const colorPalette = [
  { id: 'red', bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-900', label: 'Rouge' },
  {
    id: 'blue',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-900',
    label: 'Bleu',
  },
  {
    id: 'green',
    bg: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-900',
    label: 'Vert',
  },
  {
    id: 'purple',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-900',
    label: 'Violet',
  },
  {
    id: 'yellow',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-900',
    label: 'Jaune',
  },
  {
    id: 'pink',
    bg: 'bg-pink-100',
    border: 'border-pink-300',
    text: 'text-pink-900',
    label: 'Rose',
  },
  {
    id: 'indigo',
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
    text: 'text-indigo-900',
    label: 'Indigo',
  },
  {
    id: 'cyan',
    bg: 'bg-cyan-100',
    border: 'border-cyan-300',
    text: 'text-cyan-900',
    label: 'Cyan',
  },
]

const notes = computed(() =>
  authStore.notes.map((note: any) => ({
    ...note,
    colorObj: getColorObj(note.color),
  })),
)

// Récupère l'objet couleur à partir de l'ID ou génère une nouvelle
function getColorObj(colorId?: string) {
  if (colorId) {
    return colorPalette.find((c) => c.id === colorId) || colorPalette[0]
  }
  return colorPalette[0] // Couleur par défaut
}

// Génère un ID de couleur aléatoire
function getRandomColorId(): string {
  const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]
  return randomColor?.id || 'red'
}

//je charge la liste des notes
onMounted(async () => {
  try {
    await authStore.fetchNotes()
  } catch (error) {
    console.error('Erreur lors du chargement des notes', error)
  }
})

//Ajouter une nouvelle note
const createNewNote = async () => {
  const newNote = {
    title: '',
    content: '',
    date: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    color: getRandomColorId(),
  }

  await authStore.addNotes(newNote)
}

//Mise a jour en temps reel
const UpdateNote = async (id: number, field: 'title' | 'content', event: Event) => {
  const target = event.target as HTMLElement
  const note = notes.value.find((n: any) => n.id === id)
  if (note) {
    const updateNote = {
      title: note.title,
      content: note.content,
      date: note.date,
      color: note.color,
      [field]: target.innerText,
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
        <h1 class="mb-2 text-xl font-bold md:text-2xl">Mes Notes & Mémos</h1>
        <p class="text-sm text-slate-500">
          Garde sous le coude tes idées de candidatures, contacts clés ou checklists.
        </p>
      </div>

      <div class="w-full md:w-auto">
        <button
          type="button"
          class="flex w-full items-center justify-center rounded-2xl bg-purple-700 p-4 font-semibold text-white shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-purple-800 active:scale-95 md:w-auto"
          @click="createNewNote"
        >
          <i class="mdi mdi-file-plus-outline mr-2 text-xl text-white"></i>
          Nouveau Mémo
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="note in notes"
        :key="note.id"
        :class="[
          'group relative flex min-h-50 flex-col justify-between rounded-2xl border p-5 shadow-sm',
          note.colorObj.bg,
          note.colorObj.border,
          note.colorObj.text,
        ]"
      >
        <div>
          <button
            @click="deleteNotes(note.id)"
            class="absolute top-3 right-3 z-10 rounded-xl p-1.5 text-amber-600 transition-colors hover:bg-rose-200 hover:text-rose-600"
            title="Supprimer"
          >
            <i class="mdi mdi-trash-can text-lg"></i>
          </button>

          <h3
            contenteditable="true"
            @blur="UpdateNote(note.id, 'title', $event)"
            class="mb-2 pr-6 text-lg font-bold wrap-break-word text-amber-950 outline-none empty:before:font-normal empty:before:text-amber-700/40 empty:before:content-['Ajouter_un_titre...']"
          >
            {{ note.title }}
          </h3>

          <p
            contenteditable="true"
            @blur="UpdateNote(note.id, 'content', $event)"
            class="min-h-15 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-amber-900 outline-none empty:before:text-amber-700/40 empty:before:content-['Ajouter_le_corps_de_la_note...']"
          >
            {{ note.content }}
          </p>
        </div>

        <div
          class="mt-4 flex items-center justify-between border-t border-amber-200/60 pt-3 text-[11px] font-bold tracking-wide text-amber-600 uppercase"
        >
          <span class="flex items-center gap-1">
            <i class="mdi mdi-clock-outline"></i>
            <p v-if="note.updated_at && note.updated_at !== note.created_at">
              {{ formatApiDate(note.updated_at) }}
            </p>
            <p v-else>
              {{ note.created_at ? formatApiDate(note.created_at) : '' }}
            </p>
          </span>
          <span class="rounded bg-amber-200 px-1.5 py-0.5 text-[9px] text-amber-800">Edit</span>
        </div>
      </div>
    </div>

    <div
      v-if="notes.length === 0"
      class="rounded-3xl border-2 border-dashed border-slate-300 py-20 text-center text-slate-400"
    >
      <i class="mdi mdi-note-plus-outline mb-2 block text-5xl text-slate-300"></i>
      <p class="font-medium text-slate-500">Aucun mémo pour le moment</p>
    </div>
  </section>
</template>
