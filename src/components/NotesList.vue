<template>
  <div class="mt-10 space-y-8">
    <div v-for="(notes, date) in groupedNotes" :key="date" 
      class="space-y-4 first:animate-fadeIn"
    >
      <DateHeader :date="date" />
      <NoteGroup :notes="notes" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import DateHeader from './DateHeader.vue';
import NoteGroup from './NoteGroup.vue';

const props = defineProps({
  notes: {
    type: Array,
    required: true
  },
  search: {
    type: String,
    default: ''
  }
});

// Extract filtering logic to a separate computed property
const filteredNotes = computed(() => 
  props.notes.filter(note =>
    note.title.toLowerCase().includes(props.search.toLowerCase())
  )
);

// Separate grouping logic
const groupedNotes = computed(() => 
  filteredNotes.value.reduce((acc, note) => {
    acc[note.date] = acc[note.date] || [];
    acc[note.date].push(note);
    return acc;
  }, {})
);
</script> 