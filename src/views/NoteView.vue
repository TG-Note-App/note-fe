<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div class="w-80 bg-gray-100 border-r border-gray-200">
        <div class="p-4">
          <RouterLink 
            to="/notes" 
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <span class="material-icons mr-2">arrow_back</span>
            Back to Notes
          </RouterLink>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Note Header -->
        <div class="border-b border-gray-200 p-4 bg-white">
          <input
            v-model="note.title"
            class="text-2xl font-semibold w-full outline-none"
            placeholder="Note Title"
          />
          <div class="text-sm text-gray-500 mt-1">
            Last modified: {{ formatDate(note.lastModified) }}
          </div>
        </div>

        <!-- Note Content -->
        <div class="flex-1 p-6">
          <textarea
            v-model="note.text"
            class="w-full h-full outline-none resize-none text-lg"
            placeholder="Start writing your note..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const note = ref({
  id: null,
  title: '',
  text: '',
  lastModified: new Date()
})

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch note data when component mounts
onMounted(async () => {
  // This is where you would typically fetch the note data from your backend
  // For now, we'll use mock data
  note.value = {
    id: route.params.id,
    title: 'Sample Note',
    text: 'This is the content of your note...',
    lastModified: new Date()
  }
})
</script>

<style scoped>
/* Add smooth transitions */
input, textarea {
  transition: all 0.2s ease;
}

/* Style placeholder text */
input::placeholder,
textarea::placeholder {
  color: #9CA3AF;
}

/* Remove default textarea styling */
textarea {
  border: none;
  background: transparent;
}
</style> 