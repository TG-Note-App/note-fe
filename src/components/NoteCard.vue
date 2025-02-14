<template>
  <div>
    <!-- Add modal -->
    <div v-if="showDeleteModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div class="bg-gray-800 p-6 rounded-xl flex flex-col items-center gap-4" @click.stop>
        <img src="../assets/delete-note.png" alt="Duck" class="w-52 h-52 drop-shadow-2xl" />
        <p class="text-white text-xl">Вы уверены что хотите удалить заметку?</p>
        <div class="flex gap-4">
          <button 
            @click="confirmDelete" 
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Да
          </button>
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Нет
          </button>
        </div>
      </div>
    </div>

    <div 
      class="group relative overflow-hidden rounded-xl p-6 cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 hover:border-blue-500/30 hover:-translate-y-1 border border-gray-700/50 shadow-lg hover:shadow-xl transform transition-all duration-500 motion-safe:animate-fadeIn"
    >
      <!-- Add delete button -->
      <button
        @click.stop="handleDelete"
        class="absolute right-0 top-0 h-full w-16
          bg-gray-900/80
          transition-all duration-300 z-10 flex items-center justify-center
          opacity-100" 
      >
        <i class="bi bi-trash text-xl text-red-500"></i>  
      </button>
      
      <div class="flex gap-3 h-full">
        <RouterLink :to="'/notes/' + props.id" class="flex-1 min-w-0">
          <div 
            class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500
              animate-gradient-x"
          />
          
          <!-- Content container -->
          <div class="relative">
            <h4 
              class="mb-2 flex items-center text-xl font-medium text-white
                group-hover:text-blue-200 transition-colors duration-300"
            >
              {{ props.title }}
            </h4>
            
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-gray-500 flex-shrink-0">
                {{ new Date(props.lastModified).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                }) }}
              </span>

              <p 
                ref="textPreview"
                class="flex-1 min-w-0 line-clamp-1 leading-relaxed text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis
                  group-hover:text-gray-300 transition-colors duration-300"
              >
                {{ props.text }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useNotesStore } from '../stores/notesStore'

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
  }
})

const textPreview = ref(null)
const store = useNotesStore()
const emit = defineEmits(['delete'])

const showDeleteModal = ref(false)

onMounted(async () => {
  await nextTick()
  if (textPreview.value) {
    const element = textPreview.value
    const originalText = props.text
    let truncated = originalText
    
    // Create temporary span to measure text width
    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'nowrap'
    span.style.font = window.getComputedStyle(element).font
    document.body.appendChild(span)
    
    span.textContent = originalText
    const textWidth = span.offsetWidth
    const containerWidth = element.offsetWidth

    if (textWidth > containerWidth) {
      const ratio = containerWidth / textWidth
      const charCount = Math.floor(originalText.length * ratio)
      truncated = originalText.slice(0, charCount - 10) + '...'
    }
    
    document.body.removeChild(span)
    element.textContent = truncated
  }
})

const handleDelete = (event) => {
  event.preventDefault()
  showDeleteModal.value = true
}

const confirmDelete = () => {
  store.deleteNote(props.id)
  showDeleteModal.value = false
}
</script> 