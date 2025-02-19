<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
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