<template>
  <div
    class="fixed inset-0 min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-auto"
  >
    <div class="min-h-screen max-w-4xl mx-auto px-4 sm:px-8 pb-16">
      <AppHeader @new-note="handleNewNote" />
      <SearchBar v-model="search" />
      <NotesList :notes="filteredNotes" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

import { useNotesStore } from "../stores/notesStore";
import AppHeader from "../components/AppHeader.vue";
import SearchBar from "../components/SearchBar.vue";
import NotesList from "../components/NotesList.vue";

// State
const router = useRouter();
const notesStore = useNotesStore();
const search = ref("");

const filteredNotes = computed(() => notesStore.filteredNotes(search.value));

// Добавляем функцию для принудительного обновления списка заметок
const refreshNotes = async () => {
  const tg = window.Telegram?.WebApp;
  const userId = tg?.initDataUnsafe?.user?.id ?? 336204548;
  await notesStore.fetchNotes(userId);
};

// Вызываем обновление при каждом входе на страницу
onBeforeMount(() => {
  refreshNotes();
});

onMounted(() => {
  // Handle case where Telegram WebApp is not available
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    console.warn("Telegram WebApp is not available");
    return;
  }

  // Подготовка к получению данных
  tg.ready();

  const userId = tg?.initDataUnsafe?.user?.id ?? 0;
  console.log("Telegram ID:", userId);
});

const handleNewNote = () => {
  router.push("/notes/new");
};
</script>

<style>
body {
  @apply bg-black;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
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
