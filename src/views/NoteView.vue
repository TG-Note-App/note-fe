<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div class="max-w-4xl mx-auto h-screen flex flex-col">
      <NoteToolbar 
        @share="handleShare"
        @format="handleFormat"
        @toggle-checklist="handleToggleChecklist"
        @more="handleMore"
      />
      <NoteEditor
        v-model:title="note.title"
        v-model:content="note.text"
        @update:content="handleContentUpdate"
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
// Get note from store
const note = ref<Note>({
  id: null,
  title: '',
  text: '',
  lastModified: new Date()
})





async function saveNote() {
  // Implement save logic here
  console.log('Saving note...', note.value)
}

// Event handlers
function handleContentUpdate() {
//   note.lastModified = new Date()
}

function handleShare() {
  // Implement share logic
}

function handleFormat() {
  // Implement format logic
}

function handleToggleChecklist() {
  // Implement checklist logic
}

function handleMore() {
  // Implement more options logic
}

</script>

<style>
/* Move to global styles or separate style file */
</style> 