<template>
  <button
    class="w-16 transition-all duration-300 z-10 flex items-center justify-center"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])

const handleClick = (event) => {
  event.stopPropagation()
  emit('click', event)
}
</script> 