<template>
  <h3 class="text-gray-400 text-base font-medium uppercase tracking-wider pl-2 
    flex items-center group sticky top-4 z-10 py-2">
    <span class="w-2 h-2 rounded-full bg-blue-400 mr-2 
      group-hover:scale-150 transition-transform"></span>
    {{ date }}
  </h3>
</template>

<script setup>
defineProps({
  date: {
    type: String,
    required: true
  }
});
</script> 