<template>
  <div class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
    <div class="flex flex-col gap-2 mb-3">
      <textarea
        :value="title"
        @input="handleTitleInput"
        class="text-2xl sm:text-3xl font-medium w-full outline-none bg-transparent text-white placeholder-gray-500 resize-none overflow-hidden"
        placeholder="Title"
        ref="titleInput"
      ></textarea>
    </div>
    <div class="flex gap-4 overflow-x-auto pb-10">
        <NoteAttachment
          v-for="i in 20"
          :key="i"
          filename="test"
          ext="docx"
          size="100"
        />
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
import NoteAttachment from './NoteAttachment.vue'
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
const titleInput = ref<HTMLTextAreaElement | null>(null)

const handleTitleInput = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement
  // Reset height to auto to correctly calculate the new height
  textarea.style.height = 'auto'
  // Set the height to match the scroll height
  textarea.style.height = textarea.scrollHeight + 'px'
  emit('update:title', textarea.value)
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