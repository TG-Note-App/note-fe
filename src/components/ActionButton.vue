<template>
  <button
    class="w-16 transition-all duration-300 z-10 flex items-center justify-center"
    @click.stop="$emit('click')"
  >
    <slot></slot>
  </button>
</template> 