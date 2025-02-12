<template>
  <div class="space-y-4">
    <NoteCard
      v-for="note in notes" 
      :key="note.id"
      :title="note.title"
      :text="note.text"
      :lastModified="note.lastModified"
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