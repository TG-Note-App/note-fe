<template>
  <div class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-10">
      <input
        :value="title"
        @input="handleTitleInput"
        class="text-2xl sm:text-3xl font-medium w-full outline-none bg-transparent text-white placeholder-gray-500"
        placeholder="Title"
      />
      <span class="text-sm text-gray-500 shrink-0">{{ saveStatus }}</span>
    </div>
    <textarea
      :value="content"
      @input="handleContentInput"
      class="w-full h-[calc(100%-8rem)] outline-none resize-none text-lg bg-transparent text-gray-300 placeholder-gray-600"
      placeholder="Start writing..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { debounce } from 'lodash'

const props = defineProps<{
  title: string
  content: string
}>()

const emit = defineEmits<{
  'update:title': [value: string]
  'update:content': [value: string]
  'save': [title: string, content: string]
}>()

const saveStatus = ref('')

const handleTitleInput = (e: Event) => {
  emit('update:title', (e.target as HTMLInputElement).value)
}

const handleContentInput = (e: Event) => {
  emit('update:content', (e.target as HTMLTextAreaElement).value)
}

const debouncedSave = debounce((title: string, content: string) => {
  saveStatus.value = 'Saving...'
  emit('save', title, content)
  setTimeout(() => {
    saveStatus.value = 'Saved'
    setTimeout(() => {
      saveStatus.value = ''
    }, 1000)
  }, 500)
}, 1000)

watch(
  () => [props.title, props.content],
  ([newTitle, newContent]) => {
    debouncedSave(newTitle, newContent)
  }
)

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