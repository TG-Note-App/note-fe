<template>
  <h3 class="text-lg font-medium uppercase tracking-wider pl-2 
    flex items-center group sticky top-4 z-10 py-2 text-gray-400">
    <span v-if="title === 'ЗАКРЕПЛЕНО'" class="w-3 h-3 mr-2 flex items-center">
      <i class="bi bi-pin text-sm text-blue-400"></i>
    </span>
    <span v-else class="w-2 h-2 rounded-full bg-blue-400 mr-2 
      group-hover:scale-150 transition-transform"></span>
    {{ title }}
  </h3>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script> 