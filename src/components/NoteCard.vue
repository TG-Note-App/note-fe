<template>
  <div 
    class="group relative overflow-hidden rounded-xl p-6 cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 hover:border-blue-500/30 hover:-translate-y-1 border border-gray-700/50 shadow-lg hover:shadow-xl transform transition-all duration-500 motion-safe:animate-fadeIn"
  >
    <!-- Gradient overlay -->
    <div 
      class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
        animate-gradient-x"
    />
    
    <!-- Content container -->
    <div class="relative">
      <h4 
        class="mb-3 flex items-center text-xl font-medium text-white
          group-hover:text-blue-200 transition-colors duration-300"
      >
        {{ title }}
      </h4>
      
      <div class="flex items-start gap-3">
        <p 
          class="flex-1 line-clamp-2 leading-relaxed text-gray-400
            group-hover:text-gray-300 transition-colors duration-300"
        >
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script> 