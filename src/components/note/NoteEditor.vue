<template>
  <div class="flex-1 overflow-y-auto px-8 py-6 relative">
    <!-- Add save status indicator -->
    <div class="absolute top-4 right-4 text-sm text-gray-500">
      {{ saveStatus }}
    </div>
    
    <input
      :value="title"
      @input="handleTitleInput"
      class="text-3xl font-medium w-full outline-none bg-transparent text-white placeholder-gray-500 mb-10"
      placeholder="Title"
    />
    <textarea
      :value="content"
      @input="handleContentInput"
      class="w-full h-[calc(100%-8rem)] outline-none resize-none text-lg bg-transparent text-gray-300 placeholder-gray-600"
      placeholder="Start writing..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'

defineProps<{
  title: string
  content: string
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:content': [value: string]
}>()

const saveStatus = ref('')

const updateSaveStatus = () => {
  saveStatus.value = 'Saving...'
  setTimeout(() => {
    saveStatus.value = 'Saved'
    setTimeout(() => {
      saveStatus.value = ''
    }, 2000)
  }, 500)
}

const handleTitleInput = debounce((e: Event) => {
  emit('update:title', (e.target as HTMLInputElement).value)
  updateSaveStatus()
}, 300)

const handleContentInput = debounce((e: Event) => {
  emit('update:content', (e.target as HTMLTextAreaElement).value)
  updateSaveStatus()
}, 300)
</script>

<script lang="ts">
export default {
  name: 'NoteEditor'
}
</script>

<style scoped>
input, textarea {
  transition: all 0.2s ease;
}

input::placeholder,
textarea::placeholder {
  @apply text-gray-600;
}

textarea {
  border: none;
  background: transparent;
}
</style> 