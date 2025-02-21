<template>
  <div class="h-12 flex items-center justify-between mt-3 px-4 border-b border-gray-700/50">
    <!-- Back Button Component -->
    <RouterLink 
      to="/notes" 
      class="toolbar-button"
      @click.prevent="handleBack"
    >
      <i class="bi bi-arrow-left text-xl"></i>
    </RouterLink>

    <!-- Action Buttons -->
    <div class="flex items-center space-x-2">
      <button 
        v-for="action in actionButtons" 
        :key="action.title"
        class="toolbar-button" 
        :title="action.title"
        @click="action.handler"
      >
        <i :class="['bi', action.icon, 'text-2xl']"></i>
      </button>
      
      <!-- Hidden file input -->
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        multiple
        @change="handleFileSelect"
      />
    </div>

    <!-- Overlay -->
    <div 
      v-if="showSidePanel" 
      class="fixed inset-0 transition-opacity duration-200"
      style="z-index: 999;"
      @click="toggleSidePanel"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, withDefaults } from 'vue'
import { useRouter } from 'vue-router'
import type { NoteToolbarProps, ActionButton } from '../../types/types' // You'll need to create this

const router = useRouter()
const props = withDefaults(defineProps<{
  noteTitle?: string
  noteContent?: string
  isNewNotePage?: boolean
  lastModified?: string  // Change type to string since that's what we're receiving
  // ... any other props
}>(), {
  noteTitle: '',
  noteContent: '',
  isNewNotePage: false,
  lastModified: ''
})
const emit = defineEmits([
  'add-attachment', 'format', 'toggle-checklist', 'new-note', 
  'save', 'file-selected', 'find-in-note', 'delete-note', 
  'search-closed', 'find-next', 'search-updated'
])

const onBackClick = inject('onBackClick', () => {})
const showSidePanel = ref(false)

// Create a computed property to convert the string to Date when needed
const lastModifiedDate = computed(() => 
  props.lastModified ? new Date(props.lastModified) : new Date()
)

// Extracted sharing logic
const shareNote = async () => {
  if (!navigator.share) {
    alert('Sharing is not supported in your browser')
    return
  }

  try {
    await navigator.share({
      title: props.noteTitle || 'Empty title',
      text: props.noteContent || 'Empty content',
    })
  } catch (error) {
    console.error('Error sharing:', error)
  }
}

// Handlers
const handleBack = async () => {
  emit('save')
  onBackClick()
  router.push('/notes')
}

const handleNewNote = () => router.push('/notes/new')

// Action buttons configuration
const actionButtons = computed<ActionButton[]>(() => [
  {
    title: 'Share',
    icon: 'bi-share',
    handler: shareNote
  },
  {
    title: 'Delete',
    icon: 'bi-trash',
    handler: () => emit('delete-note')
  },
  {
    title: 'Add Attachment',
    icon: 'bi-paperclip',
    handler: () => fileInputRef.value?.click()
  }
])
if (!props.isNewNotePage) {
  actionButtons.value.push({
    title: 'New Note',
    icon: 'bi-plus-square',
    handler: handleNewNote
  })
}

// Add file input ref
const fileInputRef = ref<HTMLInputElement | null>(null)

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

<style scoped>
.toolbar-button {
  @apply p-4 text-gray-300 hover:text-blue-300 transition-colors;
}
</style>

<script lang="ts">
export default {
  name: 'NoteToolbar'
}
</script> 