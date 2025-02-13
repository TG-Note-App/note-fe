<template>
  <div class="flex justify-between items-center text-white pt-12 pb-6">
    <h2 
      class="text-5xl font-bold tracking-wider hover:text-gray-300 transition-all duration-300 
        bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent 
        transform cursor-default"
    >
      Заметки
    </h2>
    <button 
      class="w-14 h-14 rounded-full 
        bg-gradient-to-r from-gray-700 to-gray-800 
        hover:from-gray-600 hover:to-gray-700 
        transition-all duration-300 shadow-lg 
        flex items-center justify-center 
        transform hover:scale-110 hover:rotate-180 
        hover:shadow-xl hover:shadow-gray-700/30"
    >
      <i 
      class="bi bi-plus-lg text-2xl"
      @click="$emit('new-note')"
      >
    </i>
    </button>
  </div>
</template>

<script setup>
import 'bootstrap-icons/font/bootstrap-icons.css'

defineEmits(['new-note']);
</script> 