<template>
  <div class="search-container group">
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Поиск заметок..."
      class="search-input"
    />
    <i 
      class="bi bi-search search-icon cursor-pointer" 
    ></i>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-container {
  @apply mt-5 sm:mt-10 relative w-full max-w-4xl mx-auto px-2 mb-5 sm:px-0;
}

.search-input {
  @apply w-full 
    bg-gray-800/50 
    text-white 
    pl-10 
    sm:pl-12 
    pr-4 
    sm:pr-6 
    py-2   
    sm:py-3
    text-sm 
    sm:text-base 
    rounded-lg 
    sm:rounded-xl 
    border 
    border-gray-700/30
    backdrop-blur-sm 
    shadow-lg
    transition-all 
    duration-300
    placeholder-gray-400;

  @apply hover:bg-gray-700/50 
    hover:shadow-xl 
    hover:shadow-emerald-500/10 
    hover:border-emerald-500/30;

  @apply focus:outline-none 
    focus:ring-2 
    focus:ring-emerald-500/50;
}

.search-icon {
  @apply h-4 
    sm:h-5 
    w-4 
    sm:w-5 
    absolute 
    left-6
    sm:left-3
    top-[50%] 
    -translate-y-[50%] 
    text-gray-400 
    transition-colors 
    duration-300 
    group-hover:text-emerald-400
    flex
    items-center
    justify-center;

  /* Ensure icon is rendered straight */
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
</style>
  