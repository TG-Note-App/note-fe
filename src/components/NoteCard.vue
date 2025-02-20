<template>
  <div>
    <DeleteNoteModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <div 
      class="group relative overflow-hidden rounded-xl p-2 sm:p-4 md:p-6 cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-indigo-950/50 hover:border-blue-500/30 hover:-translate-y-1 border border-gray-700/50 shadow-lg hover:shadow-xl transform transition-all duration-500 motion-safe:animate-fadeIn"
    >
      <div class="absolute right-0 top-0 h-full flex">
        <ActionButton
          @click="handlePin"
          class="bg-blue-700/20 hover:bg-blue-700/50 border-l"
        >
          <i class="bi text-base sm:text-lg md:text-xl text-blue-500" :class="{ 'bi-pin-fill': props.isPinned, 'bi-pin': !props.isPinned }"></i>
        </ActionButton>
        <ActionButton
          @click="handleDelete"
          class="bg-red-900/80 hover:bg-red-800/80"
        >
          <i class="bi bi-trash text-base sm:text-lg md:text-xl text-red-500"></i>
        </ActionButton>
      </div>
      
      <RouterLink :to="`/notes/${props.id}`" class="flex-1 min-w-0" @click.stop>
        <div class="hover-gradient-overlay" />
        <div class="relative">
          <h4 class="note-title text-base md:text-xl">{{ truncatedTitle }}</h4>
          <div class="flex flex-row items-center gap-2 sm:gap-3 min-w-0">
            <span class="text-gray-500 flex-shrink-0 text-[14px] sm:text-sm whitespace-nowrap">
              {{ formatDate(props.lastModified) }}
            </span>
            <p ref="textPreview" class="note-preview text-sm sm:text-base">
              {{ truncatedText }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useNotesStore } from '../stores/notesStore'
import DeleteNoteModal from './DeleteNoteModal.vue'
import ActionButton from './ActionButton.vue'

const notesStore = useNotesStore()
const showDeleteModal = ref(false)

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  lastModified: {
    type: Date,
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
})

const textPreview = ref(null)
const truncatedContent = ref('')
const truncatedTitleContent = ref('')
let resizeObserver = null

// Watch for changes in props.text and container size
const updateTruncatedText = () => {
  if (!props.text) {
    truncatedContent.value = ''
    return
  }
  
  const text = props.text.trim()
  
  if (!textPreview.value) {
    truncatedContent.value = text
    return
  }
  
  // Force a reflow to ensure correct measurements
  textPreview.value.offsetHeight

  const container = textPreview.value
  const containerWidth = container.offsetWidth
  
  // Calculate buttons width
  const buttons = container.closest('.group').querySelector('.absolute')
  const buttonsWidth = buttons ? buttons.offsetWidth : 0
  
  // Create a temporary span to measure text
  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.whiteSpace = 'nowrap'
  span.style.position = 'absolute'
  span.style.fontSize = window.getComputedStyle(container).fontSize
  span.textContent = text
  document.body.appendChild(span)
  
  const textWidth = span.offsetWidth
  document.body.removeChild(span)

  // Use available width (container width minus buttons width)
  const availableWidth = containerWidth - buttonsWidth
  
  if (textWidth > availableWidth) {
    // Calculate approximate char count that will fit
    const approxChars = Math.floor((availableWidth / textWidth) * text.length)
    const lastSpace = text.lastIndexOf(' ', approxChars)
    
    truncatedContent.value = lastSpace !== -1 
      ? text.slice(0, lastSpace) + '... '
      : text.slice(0, approxChars) + '... '
  } else {
    truncatedContent.value = text
  }
}

// Watch for text changes with immediate option
watch(() => props.text, updateTruncatedText, { immediate: true })

const updateTruncatedTitle = () => {
  if (!props.title) {
    truncatedTitleContent.value = ''
    return
  }
  
  const title = props.title.trim()
  
  if (!textPreview.value) {
    truncatedTitleContent.value = title
    return
  }
  
  const container = textPreview.value.closest('.group')
  const containerWidth = container.offsetWidth
  
  // Calculate buttons width
  const buttons = container.querySelector('.absolute')
  const buttonsWidth = buttons ? buttons.offsetWidth : 0
  
  // Create a temporary span to measure text
  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.whiteSpace = 'nowrap'
  span.style.position = 'absolute'
  span.style.fontSize = window.getComputedStyle(container.querySelector('.note-title')).fontSize
  span.textContent = title
  document.body.appendChild(span)
  
  const titleWidth = span.offsetWidth
  document.body.removeChild(span)

  // Use available width (container width minus buttons width and some padding)
  const availableWidth = containerWidth - buttonsWidth - 32 // 32px for padding
  
  if (titleWidth > availableWidth) {
    // Calculate approximate char count that will fit
    const approxChars = Math.floor((availableWidth / titleWidth) * title.length)
    const lastSpace = title.lastIndexOf(' ', approxChars)
    
    truncatedTitleContent.value = lastSpace !== -1 
      ? title.slice(0, lastSpace) + '...'
      : title.slice(0, approxChars) + '...'
  } else {
    truncatedTitleContent.value = title
  }
}

// Watch for title changes
watch(() => props.title, updateTruncatedTitle, { immediate: true })

const truncatedText = computed(() => truncatedContent.value)
const truncatedTitle = computed(() => truncatedTitleContent.value)

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
  notesStore.deleteNote(props.id)
  showDeleteModal.value = false
}

const handlePin = (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  notesStore.togglePin(props.id)
}

onMounted(() => {
  // Update both text and title
  updateTruncatedText()
  updateTruncatedTitle()
  
  // Set up resize observer
  resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      updateTruncatedText()
      updateTruncatedTitle()
    })
  })
  
  if (textPreview.value) {
    resizeObserver.observe(textPreview.value)
    // Also observe the parent container for layout changes
    if (textPreview.value.parentElement) {
      resizeObserver.observe(textPreview.value.parentElement)
    }
  }
})

onUnmounted(() => {
  // Clean up resize observer
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style scoped>
.hover-gradient-overlay {
  @apply absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 
    opacity-0 group-hover:opacity-100 transition-opacity duration-500
    animate-gradient;
}

.note-title {
  @apply mb-2 flex items-center font-medium text-white
    group-hover:text-blue-200 transition-colors duration-300;
}

.note-preview {
  @apply flex-1 min-w-0 line-clamp-1 leading-relaxed text-gray-400 
    whitespace-nowrap overflow-hidden text-ellipsis
    group-hover:text-gray-300 transition-colors duration-300;
}
</style> 