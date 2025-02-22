<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <DeleteNoteModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />

    <div class="max-w-4xl mx-auto h-screen flex flex-col">
      <NoteToolbar
          :note-id="noteRef.id ? Number(noteRef.id) : undefined"
          @delete-note="handleDelete"
          @file-selected="handleFileSelected"
          :isNewNotePage="false"
          :noteTitle="noteRef.title"
          :noteContent="noteRef.content"
          :attachments="noteRef.attachments"
      />
      <div v-if="noteRef.attachments?.length" class="space-y-2 p-4">
        <NoteAttachment
          v-for="attachment in noteRef.attachments"
          :key="attachment.id"
          v-bind="attachment"
        />
      </div>
      <NoteEditor
        v-model:title="noteRef.title"
        v-model:content="noteRef.content"
        :attachments="noteRef.attachments"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from '@vue/runtime-dom'
import { useRoute , useRouter} from 'vue-router'
import { useNotesStore } from '../stores/notesStore'
import NoteToolbar from '../components/note/NoteToolbar.vue'
import NoteEditor from '../components/note/NoteEditor.vue'
import DeleteNoteModal from '../components/DeleteNoteModal.vue'
import type { Note } from '../types/note'
import NoteAttachment from '../components/note/NoteAttachment.vue'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const showDeleteModal = ref(false)
// Get note ID from URL
const noteId = parseInt(route.params.id as string)
// Get note from store
const note = computed(() => notesStore.notes.find(note => note.id === noteId))
const noteRef = ref<Note>({
  id: note.value?.id?.toString() ?? null,
  title: note.value?.title ?? '',
  content: note.value?.content ?? '',
  lastModified: new Date(),
  attachments: note.value?.attachments ?? []
})

const handleDelete = (event) => {
  if (event) {  // Check if event exists
    event.preventDefault()
    event.stopPropagation()
  }
  console.log('handleDelete')
  showDeleteModal.value = true
}

const confirmDelete = () => {
  notesStore.deleteNote(noteId)
  showDeleteModal.value = false
  router.push('/notes')
}

// Add this function to handle file selection
const handleFileSelected = async (files: Array<{
  file: File,
  filename: string,
  ext: string,
  size: number
}>) => {
  console.log('Files received:', files);

  const filePromises = files.map(({ file, filename, ext, size }) => 
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('File read result:', reader.result); // Debug log
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    }).then(url => {
      console.log('Processing URL:', url); // Debug log
      return {
        id: crypto.randomUUID(),
        filename,
        extension: ext,
        size,
        url
      };
    })
  );

  const newAttachments = await Promise.all(filePromises);
  console.log('New attachments:', newAttachments); // Verify attachments have URLs

  noteRef.value = {
    ...noteRef.value,
    attachments: [...(noteRef.value.attachments || []), ...newAttachments]
  };
};

// Add watcher to sync changes back to store
watch(noteRef, (newValue) => {
  if (note.value) {
    notesStore.updateNote({
      ...note.value,
      title: newValue.title,
      content: newValue.content,
      lastModified: new Date(),
      attachments: newValue.attachments
    })
  }
}, { deep: true })

</script>
