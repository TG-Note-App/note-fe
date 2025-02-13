<template>
  <div class="space-y-4">
    <NoteCard
      v-for="note in notes" 
      :key="note.id"
      :id="note.id"
      :title="note.title"
      :text="note.text"
      :lastModified="note.lastModified"
      @delete="$emit('deleteNote', note.id)"
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

defineEmits(['deleteNote']);
</script> 