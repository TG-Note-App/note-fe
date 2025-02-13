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
  @apply mt-10 relative;
}

.search-input {
  @apply w-full 
    bg-gray-800/50 
    text-white 
    pl-12 
    pr-6 
    py-4 
    rounded-xl 
    border 
    border-gray-700/30
    backdrop-blur-sm 
    shadow-lg
    transition-all 
    duration-300
    placeholder-gray-400;

  @apply hover:bg-gray-700/50 
    hover:shadow-xl 
    hover:shadow-blue-500/10 
    hover:border-blue-500/30;

  @apply focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500/50;
}

.search-icon {
  @apply h-5 
    w-5 
    absolute 
    left-4 
    top-1/2 
    transform 
    -translate-y-1/2 
    text-gray-400 
    transition-colors 
    duration-300 
    group-hover:text-blue-400;
}
</style>
  