<template>
  <div class="mt-10 space-y-8">
    <div v-for="(notes, timeGroup) in groupedNotes" :key="timeGroup" 
      class="space-y-4 first:animate-fadeIn"
    >
      <DateHeader :date="timeGroup" />
      <NoteGroup 
        :notes="notes" 
      />
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

// Helper function to check if date is today
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Helper function to check if date is yesterday
const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

// Helper function to check if date is within last N days
const isWithinDays = (date, days) => {
  const compareDate = new Date();
  compareDate.setDate(compareDate.getDate() - days);
  return date >= compareDate;
};

// Updated grouping logic
const groupedNotes = computed(() => {
  const groups = {
    'СЕГОДНЯ': [],
    'ВЧЕРА': [],
    'Последние 7 дней': [],
    'Последние 30 дней': [],
    'РАНЕЕ': []
  };

  filteredNotes.value.forEach(note => {
    const noteDate = new Date(note.lastModified);
    
    if (isToday(noteDate)) {
      groups['СЕГОДНЯ'].push(note);
    } else if (isYesterday(noteDate)) {
      groups['ВЧЕРА'].push(note);
    } else if (isWithinDays(noteDate, 7)) {
      groups['Последние 7 дней'].push(note);
    } else if (isWithinDays(noteDate, 30)) {
      groups['Последние 30 дней'].push(note);
    } else {
      groups['РАНЕЕ'].push(note);
    }
  });

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, notes]) => notes.length > 0)
  );
});
</script> 