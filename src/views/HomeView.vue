<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div class="max-w-4xl mx-auto px-8">
      <AppHeader/>
      <SearchBar v-model="search" />
      <NotesList :notes="filteredNotes" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useNotesStore } from '../stores/notesStore';
import AppHeader from '../components/AppHeader.vue';
import SearchBar from '../components/SearchBar.vue';
import NotesList from '../components/NotesList.vue';

// State
const notesStore = useNotesStore();
const search = ref('');

const filteredNotes = computed(() => notesStore.filteredNotes(search.value));
</script>

<style>
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-x {
  @apply bg-[length:200%_200%];
  animation: gradient-x 15s ease infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
