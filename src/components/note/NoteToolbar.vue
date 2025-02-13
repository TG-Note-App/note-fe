<template>
  <div class="h-12 flex items-center px-4 border-b border-gray-700/50">
    <RouterLink 
      to="/notes" 
      class="flex items-center text-gray-400 hover:text-blue-300 transition-colors"
    >
      <i class="bi bi-arrow-left text-xl"></i>
    </RouterLink>

    <div class="ml-auto flex items-center space-x-3">
      <button 
        class="p-3 text-gray-400 hover:text-blue-300 transition-colors" 
        title="Share"
        @click="$emit('share')"
      >
        <i class="bi bi-share text-xl"></i>
      </button>
      <button 
        class="p-3 text-gray-400 hover:text-blue-300 transition-colors" 
        title="Format"
        @click="$emit('format')"
      >
        <i class="bi bi-text-paragraph text-xl"></i>
      </button>
      <button 
        class="p-3 text-gray-400 hover:text-blue-300 transition-colors" 
        title="Checklist"
        @click="$emit('toggle-checklist')"
      >
        <i class="bi bi-check-square text-xl"></i>
      </button>
      <button 
        class="p-3 text-gray-400 hover:text-blue-300 transition-colors" 
        title="More"
        @click="$emit('more')"
      >
        <i class="bi bi-three-dots-vertical text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Remove ToolbarButton import as it's no longer needed
</script> 