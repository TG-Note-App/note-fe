<template>
  <div class="h-12 flex items-center justify-between mt-3 px-4 border-b border-gray-700/50">
    <RouterLink 
      to="/notes" 
      class="flex items-center text-gray-300 hover:text-blue-300 transition-colors"
      @click.prevent="handleBack"
    >
      <i class="bi bi-arrow-left text-xl"></i>
    </RouterLink>

    <div class="flex items-center space-x-2">
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
        @click="toggleSidePanel"
      >
        <i class="bi bi-three-dots-vertical text-2xl"></i>
      </button>
    </div>
    

    <div class="fixed bottom-0 left-0 right-0 flex items-center justify-around space-x-4 p-4 bg-gray-900/80 backdrop-blur">
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors relative" 
        title="Add Attachment"
      >
        <input
          type="file"
          class="absolute inset-0 opacity-0 cursor-pointer"
          @change="handleFileSelect"
          multiple
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
        <i class="bi bi-list-check text-2xl"></i>
      </button>
      <button 
        class="p-4 text-gray-300 hover:text-blue-300 transition-colors" 
        title="New Note"
        @click="handleNewNote"
      >
        <i class="bi bi-plus-square text-2xl"></i>
      </button>
    </div>

    <!-- Add the side panel -->
    <div 
      v-if="showSidePanel" 
      class="fixed top-12 right-4 w-64 bg-gray-800/95 backdrop-blur-xl shadow-2xl transform transition-all duration-200 ease-out rounded-xl border border-gray-700/30"
      style="z-index: 1000;"
    >
      <div class="py-1">
        <button 
          class="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-700/50 transition-all duration-150 flex items-center group"
        >
          <i class="bi bi-search mr-3 text-gray-400 group-hover:text-blue-300"></i>
          <span class="text-sm">Find in Note</span>
        </button>
        <div class="h-[1px] bg-gray-700/30 mx-2"></div>
        <button 
          class="w-full text-left px-4 py-3 text-gray-300 transition-all duration-150 flex items-center group hover:bg-gray-700/50"
          @click="$emit('delete-note')"
        >
          <i class="bi bi-trash mr-3 text-red-700 "></i>
          <span class="text-sm">Удалить заметку</span>
        </button>
      </div>
    </div>

    <!-- Add overlay to close panel when clicking outside -->
    <div 
      v-if="showSidePanel" 
      class="fixed inset-0 transition-opacity duration-200"
      style="z-index: 999;"
      @click="toggleSidePanel"
    ></div>

  </div>
</template>

<script setup lang="ts">
import { inject, ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  noteTitle?: string;
  noteContent?: string;
  noteId?: number;
  searchMatchCount?: number;
}>();

const emit = defineEmits([
  'more', 
  'add-attachment', 
  'format', 
  'toggle-checklist', 
  'new-note', 
  'save',
  'file-selected',
  'find-in-note',
  'delete-note',
  'search-closed',
  'find-next',
  'search-updated'
]);

const onBackClick = inject('onBackClick', () => {})

const showSidePanel = ref(false);

const handleBack = async () => {
  // First save the note
  emit('save');
  // Then execute the injected back click handler
  onBackClick();
  // Finally navigate back
  router.push('/notes');
}


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

const handleNewNote = () => {
  router.push('/notes/new');
};

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    emit('file-selected', Array.from(files));
    // Reset the input so the same file can be selected again
    (event.target as HTMLInputElement).value = '';
  }
};

const toggleSidePanel = () => {
  showSidePanel.value = !showSidePanel.value;
};
</script>

<script lang="ts">
export default {
  name: 'NoteToolbar'
}
</script> 