<template>
  <div class="flex-1 overflow-y-auto px-8 py-6">
    <input
      :value="title"
      @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
      class="text-3xl font-medium w-full outline-none bg-transparent text-white placeholder-gray-500 mb-10"
      placeholder="Title"
    />
    <textarea
      :value="content"
      @input="$emit('update:content', ($event.target as HTMLTextAreaElement).value)"
      class="w-full h-[calc(100%-8rem)] outline-none resize-none text-lg bg-transparent text-gray-300 placeholder-gray-600"
      placeholder="Start writing..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  title: string
  content: string
}>()


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