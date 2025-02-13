<template>
  <div 
    class="group relative overflow-hidden rounded-xl p-6 cursor-pointer bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 hover:border-blue-500/30 hover:-translate-y-1 border border-gray-700/50 shadow-lg hover:shadow-xl transform transition-all duration-500 motion-safe:animate-fadeIn"
  >
    <RouterLink :to="'/notes/' + id">
      <div 
      class="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
        animate-gradient-x"
    />
    
    <!-- Content container -->
    <div class="relative">
      <h4 
        class="mb-2 flex items-center text-xl font-medium text-white
          group-hover:text-blue-200 transition-colors duration-300"
      >
        {{ title }}
      </h4>
      
      <div class="flex items-center gap-3">
        <span class="text-gray-500">
          {{ new Date(props.lastModified).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
          }) }}
        </span>

        <p 
          ref="textPreview"
          class="flex-1 line-clamp-1 leading-relaxed text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis
            group-hover:text-gray-300 transition-colors duration-300"
        >
          {{ props.text }}
        </p>
      </div>
    </div>
    </RouterLink>
    <!-- Gradient overlay -->
    
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: 1,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  lastModified: {
    type: [Date, String, Number],
    required: true
  }
})

import { ref, computed, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'

const textPreview = ref(null)
const truncatedText = computed(() => {
  if (!props.text) return ''
  return props.text
})

onMounted(async () => {
  await nextTick()
  if (textPreview.value) {
    const element = textPreview.value
    const originalText = props.text
    let truncated = originalText
    
    // Create temporary span to measure text width
    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'nowrap'
    span.style.font = window.getComputedStyle(element).font
    document.body.appendChild(span)
    
    span.textContent = originalText
    const textWidth = span.offsetWidth
    const containerWidth = element.offsetWidth

    if (textWidth > containerWidth) {
      const ratio = containerWidth / textWidth
      const charCount = Math.floor(originalText.length * ratio)
      truncated = originalText.slice(0, charCount - 4) + '...'
    }
    
    document.body.removeChild(span)
    element.textContent = truncated
  }
})
</script> 