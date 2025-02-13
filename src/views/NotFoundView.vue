<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-white mb-4">404</h1>
      <p class="text-xl text-gray-300 mb-8">Заметка не найдена</p>
      <router-link 
        to="/notes" 
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Вернуться на главный экран
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script> 