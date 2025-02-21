<template>
  <div class="px-2 sm:px-0 space-y-2 sm:space-y-4">
    <NoteCard
      v-for="note in notes" 
      :key="note.id"
      :id="note.id"
      :title="note.title"
      :content="note.content"
      :lastModified="note.lastModified"
      :isPinned="note.isPinned"
    />
  </div>
</template>

<script setup>
import NoteCard from './NoteCard.vue';

defineProps({
  notes: {
    type: Array,
    required: true
  }
});

</script> 