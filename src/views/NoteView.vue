<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div class="max-w-4xl mx-auto h-screen flex flex-col">
      <NoteToolbar/>
      <NoteEditor
        v-model:title="noteRef.title"
        v-model:content="noteRef.text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotesStore } from '../stores/notesStore'
import NoteToolbar from '../components/note/NoteToolbar.vue'
import NoteEditor from '../components/note/NoteEditor.vue'
import type { Note } from '../types/note'

const route = useRoute()
const notesStore = useNotesStore()
console.log(notesStore)

// Get note ID from URL
const noteId = parseInt(route.params.id as string)
// Get note from store
const note = computed(() => notesStore.notes.find(note => note.id === noteId))
const noteRef = ref<Note>({
  id: note.value?.id?.toString() ?? null,
  title: note.value?.title ?? '',
  text: note.value?.text ?? '',
  lastModified: new Date()
})

// Add watcher to sync changes back to store
watch(noteRef, (newValue) => {
  if (note.value) {
    notesStore.updateNote({
      ...note.value,
      title: newValue.title,
      text: newValue.text,
      lastModified: new Date()
    })
  }
}, { deep: true })

</script>

<style>
/* Move to global styles or separate style file */
</style> 