<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <!-- Add modal overlay -->
      <div v-if="showTitleModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           @click="showTitleModal = false">
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-700"
             @click.stop>
          <div class="flex flex-col items-center mb-8">
            <img src="../assets/duck-icon.png" alt="Duck" class="w-52 h-52 mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
            <input
              v-model="tempTitle"
              type="text"
              class="w-full px-4 py-3 bg-slate-700/50 text-white border border-slate-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     placeholder-slate-400 transition-all duration-300"
              placeholder="Введите заголовок заметки"
              @keyup.enter="handleContinue"
            />
          </div>
          <div class="flex justify-center">
            <button
              @click="handleContinue"
              class="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transform hover:scale-105 transition-all duration-300 
                     font-medium shadow-lg hover:shadow-blue-500/25 text-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto h-screen flex flex-col">
        <NoteToolbar
          :note-id="noteRef.id ? Number(noteRef.id) : undefined"
          @delete-note="handleDeleteNote"
          :isNewNotePage="true"
        />
        <NoteEditor
          v-model:title="noteRef.title"
          v-model:content="noteRef.text"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, provide } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNotesStore } from '../stores/notesStore'
  import NoteEditor from '../components/note/NoteEditor.vue'
  import NoteToolbar from '../components/note/NoteToolbar.vue'
  import type { Note } from '../types/note'

  const notesStore = useNotesStore()
  const router = useRouter()

  const noteRef = ref<Note>({
    id: null,
    title: '',
    text: '',
    lastModified: new Date()
  })

  const showTitleModal = ref(true)
  const tempTitle = ref('')

  const handleContinue = () => {
    if (tempTitle.value.trim()) {
      noteRef.value.title = tempTitle.value
      showTitleModal.value = false
    }
  }

  // Add save functionality
  const saveNote = () => {
    const newNote = {
      ...noteRef.value,
      id: notesStore.notes.length ? Math.max(...notesStore.notes.map(note => Number(note.id))) + 1 : 1,
      lastModified: new Date()
    }
    notesStore.addNote(newNote)
  }

  // Remove the watch for auto-save and handle save on back button click
  const handleBackClick = () => {
    if (noteRef.value.title || noteRef.value.text) {
      saveNote()
    }
  }

  // Add delete handler
  const handleDeleteNote = () => {
    if (noteRef.value.id) {
      notesStore.deleteNote(noteRef.value.id)
    }
    router.push('/notes')
  }

  // Provide the method to NoteToolbar
  provide('onBackClick', handleBackClick)
  </script>
  
  <style>
  /* Move to global styles or separate style file */
  </style> 