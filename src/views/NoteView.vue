<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div class="max-w-4xl mx-auto h-screen flex flex-col">
      <NoteToolbar
          :note-id="noteRef.id ? Number(noteRef.id) : undefined"
          @delete-note="handleDeleteNote"
          :isNewNotePage="false"
        />
      <NoteEditor
        v-model:title="noteRef.title"
        v-model:content="noteRef.text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from '@vue/runtime-dom'
import { useRoute , useRouter} from 'vue-router'
import { useNotesStore } from '../stores/notesStore'
import NoteToolbar from '../components/note/NoteToolbar.vue'
import NoteEditor from '../components/note/NoteEditor.vue'
import type { Note } from '../types/note'

const route = useRoute()
const router = useRouter()
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

  // Add delete handler
  const handleDeleteNote = () => {
    if (noteRef.value.id) {
      const numericId = Number(noteRef.value.id)
      notesStore.deleteNote(numericId)
    }
    router.push('/notes')
  }

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
