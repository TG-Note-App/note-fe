<template>
  <div class="mt-4 sm:mt-10 space-y-6 sm:space-y-8">
    <div
      v-for="(notes, timeGroup) in groupedNotes"
      :key="timeGroup"
      class="space-y-1 sm:space-y-4 first:animate-fadeIn"
    >
      <DateHeader :title="timeGroup" />
      <NoteGroup :notes="notes" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import DateHeader from "./DateHeader.vue";
import NoteGroup from "./NoteGroup.vue";

const props = defineProps({
  notes: {
    type: Array,
    required: true,
  },
  search: {
    type: String,
    default: "",
  },
});

// Extract filtering logic to a separate computed property
const filteredNotes = computed(() =>
  props.notes.filter((note) =>
    note?.content?.toLowerCase().includes(props.search.toLowerCase())
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
    PINNED: [],
    TODAY: [],
    YESTERDAY: [],
    "LAST 7 DAYS": [],
    "LAST 30 DAYS": [],
    EARLIER: [],
  };

  filteredNotes.value.forEach((note) => {
    const noteDate = new Date(note.lastModified);
    if (note.isPinned) {
      groups["PINNED"].push(note);
    } else if (isToday(noteDate)) {
      groups["TODAY"].push(note);
    } else if (isYesterday(noteDate)) {
      groups["YESTERDAY"].push(note);
    } else if (isWithinDays(noteDate, 7)) {
      groups["LAST 7 DAYS"].push(note);
    } else if (isWithinDays(noteDate, 30)) {
      groups["LAST 30 DAYS"].push(note);
    } else {
      groups["EARLIER"].push(note);
    }
  });

  // Remove empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, notes]) => notes.length > 0)
  );
});
</script>
