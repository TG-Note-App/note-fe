<template>
  <div class="h-12 flex items-center justify-between mt-3 px-4 border-b border-gray-700/50">
    <RouterLink 
      to="/notes" 
      class="flex items-center text-gray-300 hover:text-blue-300 transition-colors"
    >
      <i class="bi bi-arrow-left text-xl"></i>
    </RouterLink>

    <div class="flex items-center space-x-2">
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="Save"
        @click="handleSave"
      >
        <i class="bi bi-save text-2xl"></i>
      </button>
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="Share"
        @click="handleShare"
      >
        <i class="bi bi-share text-2xl"></i>
      </button>
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="More"
        @click="$emit('more')"
      >
        <i class="bi bi-three-dots-vertical text-2xl"></i>
      </button>
    </div>
    

    <div class="fixed bottom-0 left-0 right-0 flex items-center justify-around space-x-4 p-4 bg-gray-900/80 backdrop-blur">
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="Add Attachment"
        @click="$emit('add-attachment')"
      >
        <i class="bi bi-paperclip text-2xl"></i>
      </button>
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="Format"
        @click="$emit('format')"
      >
        <i class="bi bi-type text-2xl"></i>
      </button>
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="Checklist"
        @click="$emit('toggle-checklist')"
      >
        <i class="bi bi-check-square text-2xl"></i>
      </button>
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="New Note"
        @click="$emit('new-note')"
      >
        <i class="bi bi-plus-square text-2xl"></i>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
// Define props for note content and title
const props = defineProps<{
  noteTitle?: string;
  noteContent?: string;
}>();

const emit = defineEmits(['more', 'add-attachment', 'format', 'toggle-checklist', 'new-note', 'save']);

const handleSave = () => {
  emit('save');
};

const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.noteTitle || 'Empty title',
        text: props.noteContent || 'Empty content',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    alert('Sharing is not supported in your browser');
  }
};
</script> 