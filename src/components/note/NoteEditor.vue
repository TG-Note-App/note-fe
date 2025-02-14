<template>
  <div class="flex-1 overflow-y-auto px-8 py-6">
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
defineProps<{
  title: string
  content: string
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:content': [value: string]
}>()

const handleTitleInput = (e: Event) => {
  emit('update:title', (e.target as HTMLInputElement).value)
}

const handleContentInput = (e: Event) => {
  emit('update:content', (e.target as HTMLTextAreaElement).value)
}
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