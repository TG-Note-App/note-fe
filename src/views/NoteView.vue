<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <DeleteNoteModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <div class="max-w-4xl mx-auto h-screen flex flex-col">
      <NoteToolbar
          :note-id="noteRef.id ? Number(noteRef.id) : undefined"
          @delete-note="handleDelete"
          :isNewNotePage="false"
          :noteTitle="noteRef.title"
          :noteContent="noteRef.content"
        />
      <NoteEditor
        v-model:title="noteRef.title"
        v-model:content="noteRef.content"
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
import DeleteNoteModal from '../components/DeleteNoteModal.vue'
import type { Note } from '../types/note'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const showDeleteModal = ref(false)
// Get note ID from URL
const noteId = parseInt(route.params.id as string)
// Get note from store
const note = computed(() => notesStore.notes.find(note => note.id === noteId))
const noteRef = ref<Note>({
  id: note.value?.id?.toString() ?? null,
  title: note.value?.title ?? '',
  content: note.value?.content ?? '',
  lastModified: new Date()
})

const handleDelete = (event) => {
  if (event) {  // Check if event exists
    event.preventDefault()
    event.stopPropagation()
  }
  console.log('handleDelete')
  showDeleteModal.value = true
}

const confirmDelete = () => {
  notesStore.deleteNote(noteId)
  showDeleteModal.value = false
  router.push('/notes')
}

// Add watcher to sync changes back to store
watch(noteRef, (newValue) => {
  if (note.value) {
    notesStore.updateNote({
      ...note.value,
      title: newValue.title,
      content: newValue.content,
      lastModified: new Date()
    })
  }
}, { deep: true })

</script>
