<template>
  <div class="group flex items-center w-[280px] gap-3 p-3 bg-white/90 backdrop-blur rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200">
    <!-- File Icon based on extension -->
    <div class="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl shadow-inner" 
         :class="{
           'bg-blue-100 group-hover:bg-blue-200': isDocument,
           'bg-emerald-100 group-hover:bg-emerald-200': isImage,
           'bg-violet-100 group-hover:bg-violet-200': !isImage && !isDocument
         }">
      <i v-if="isImage" 
         class="bi bi-image text-2xl"
         :class="{ 'text-emerald-600': isImage }">
      </i>
      <i v-else-if="isDocument" 
         class="bi bi-file-text text-2xl"
         :class="{ 'text-blue-600': isDocument }">
      </i>
      <i v-else 
         class="bi bi-file-earmark text-2xl"
         :class="{ 'text-violet-600': !isImage && !isDocument }">
      </i>
    </div>

    <!-- File Information -->
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-medium text-gray-800 truncate">{{ truncatedFilename }}</h3>
      <div class="flex items-center gap-2 mt-0.5">
        <span class="text-xs font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              :class="{
                'bg-blue-100 text-blue-600': isDocument,
                'bg-emerald-100 text-emerald-600': isImage,
                'bg-violet-100 text-violet-600': !isImage && !isDocument
              }">{{ extension }}</span>
        <span class="text-xs text-gray-500">{{ formattedSize }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="shrink-0 flex gap-1">
      <!-- Download Button -->
      <button 
        @click="downloadFile"
        class="p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1" 
        :class="{
          'hover:bg-blue-50 text-blue-500 hover:text-blue-600 focus:ring-blue-500': isDocument,
          'hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 focus:ring-emerald-500': isImage,
          'hover:bg-violet-50 text-violet-500 hover:text-violet-600 focus:ring-violet-500': !isImage && !isDocument
        }"
      >
        <i class="bi bi-download text-lg"></i>
      </button>

      <!-- Delete Button -->
      <button 
        @click="deleteFile"
        class="p-2 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
      >
        <i class="bi bi-trash text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-dom'

const props = defineProps<{
  file: {
    filename: string,
    extension: string,
    size: number,
    url: string
  }
}>();

const extension = computed(() => {
  return props.file?.extension || '';
});

const isImage = computed(() => {
  if (!props.file?.extension) return false;
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return imageExtensions.includes(props.file.extension.toLowerCase());
});

const isDocument = computed(() => {
  if (!props.file?.extension) return false;
  const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'];
  return docExtensions.includes(props.file.extension.toLowerCase());
});

const formattedSize = computed(() => {
  if (!props.file?.size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = props.file.size;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
});

const truncatedFilename = computed(() => {
  if (!props.file?.filename) return '';
  const maxLength = 30;
  if (props.file.filename.length <= maxLength) {
    return props.file.filename;
  }
  return props.file.filename.substring(0, maxLength) + '...';
});

const downloadFile = () => {
  emit('download', props.file.url, props.file.filename, props.file.extension);
};

// Define emits
const emit = defineEmits<{
  (e: 'delete', filename: string): void
  (e: 'download', url: string, filename: string, extension: string): void
}>();

const deleteFile = () => {
  emit('delete', props.file.filename);
};
</script>

<style>

</style>