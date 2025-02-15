<template>
  <div>
    <DeleteNoteModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <div 
      class="group relative overflow-hidden rounded-xl p-6 cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 hover:border-blue-500/30 hover:-translate-y-1 border border-gray-700/50 shadow-lg hover:shadow-xl transform transition-all duration-500 motion-safe:animate-fadeIn"
    >
      <div class="absolute right-0 top-0 h-full flex">
        <ActionButton
          @click="handlePin"
          class="bg-gray-800/90 hover:bg-gray-700/90 border-l border-gray-600"
        >
          <i class="bi bi-pin text-xl text-blue-500"></i>
        </ActionButton>
        <ActionButton
          @click="handleDelete"
          class="bg-red-900/80 hover:bg-red-800/80"
        >
          <i class="bi bi-trash text-xl text-red-500"></i>
        </ActionButton>
      </div>
      
      <RouterLink :to="`/notes/${props.id}`" class="flex-1 min-w-0" @click.stop>
        <div class="hover-gradient-overlay" />
        <div class="relative">
          <h4 class="note-title">{{ props.title }}</h4>
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-gray-500 flex-shrink-0">
              {{ formatDate(props.lastModified) }}
            </span>
            <p ref="textPreview" class="note-preview">
              {{ truncatedText }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useNotesStore } from '../stores/notesStore'
import DeleteNoteModal from './DeleteNoteModal.vue'
import ActionButton from './ActionButton.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: 1
  },
  title: String,
  text: String,
  lastModified: {
    type: [Date, String, Number],
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
})

const store = useNotesStore()
const showDeleteModal = ref(false)

const truncatedText = computed(() => {
  if (!props.text) return ''
  return props.text.length > 50 ? props.text.slice(0, 50) + '...' : props.text
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const handleDelete = (event) => {
  if (event) {  // Check if event exists
    event.preventDefault()
    event.stopPropagation()
  }
  showDeleteModal.value = true
}

const confirmDelete = () => {
  store.deleteNote(props.id)
  showDeleteModal.value = false
}

const handlePin = () => {
  store.togglePin(props.id)
}
</script>

<style scoped>
.hover-gradient-overlay {
  @apply absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 
    opacity-0 group-hover:opacity-100 transition-opacity duration-500
    animate-gradient;
}

.note-title {
  @apply mb-2 flex items-center text-xl font-medium text-white
    group-hover:text-blue-200 transition-colors duration-300;
}

.note-preview {
  @apply flex-1 min-w-0 line-clamp-1 leading-relaxed text-gray-400 
    whitespace-nowrap overflow-hidden text-ellipsis
    group-hover:text-gray-300 transition-colors duration-300;
}
</style> 