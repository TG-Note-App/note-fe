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
      <NoteEditor
        v-model:title="noteRef.title"
        v-model:content="noteRef.content"
        :attachments="noteRef.attachments"
        @delete-attachment="handleFileDelete"
        @download-attachment="handleFileDownload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from '@vue/runtime-dom'
import { useRoute , useRouter} from 'vue-router'
import { useNotesStore } from '../stores/notesStore'
import NoteToolbar from '../components/note/NoteToolbar.vue'
import NoteEditor from '../components/note/NoteEditor.vue'
import DeleteNoteModal from '../components/DeleteNoteModal.vue'
import type { Note } from '../types/note'
import { debounce } from 'lodash'
import { isEqual } from 'lodash'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const showDeleteModal = ref(false)

// Get note ID from URL
const noteId = parseInt(route.params.id as string)

const noteRef = ref<Note>({
  id: null,
  title: '',
  content: '',
  lastModified: new Date(),
  attachments: [],
  isPinned: false,
})

// Add a ref to store the previous state
const previousNoteState = ref<Note | null>(null)

// Add onMounted hook to fetch note and file info
onMounted(async () => {
  try {
    // Fetch note data
    const note = await notesStore.fetchNoteById(noteId)
    
    // Update noteRef with the fetched note data
    if (note) {
      noteRef.value = {
        id: note.id?.toString() ?? null,
        title: note.title ?? '',
        content: note.content ?? '',
        lastModified: note.lastModified ?? new Date(),
        attachments: note.attachments ?? [],
        isPinned: note.isPinned ?? false,
      }
    } else {
      throw new Error('Note not found')
    }
  } catch (error) {
    console.error('Error fetching note:', error)
    router.push('/notes')
  }
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
  try {
    const filePromises = files.map(({ file, filename, ext, size }) => 
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      }).then(async (url) => {
        // Create temporary attachment object with proper extension
        const tempAttachment = {
          id: crypto.randomUUID(),
          filename: filename,
          // Remove the dot if it exists in the extension
          extension: ext.toLowerCase().replace(/^\./, ''),
          size: size,
          url: url
        };

        // For debugging
        console.log('Created temp attachment:', tempAttachment);

        // Upload the attachment and get the saved version from backend
        if (noteRef.value.id) {
          const savedAttachment = await notesStore.uploadAttachment(
            parseInt(noteRef.value.id),
            tempAttachment
          );
          console.log('Saved attachment:', savedAttachment);
          return savedAttachment;
        }
        return tempAttachment;
      })
    );

    const newAttachments = await Promise.all(filePromises);
    console.log('New attachments:', newAttachments);

    noteRef.value = {
      ...noteRef.value,
      attachments: [...(noteRef.value.attachments || []), ...newAttachments]
    };
  } catch (error) {
    console.error('Error uploading files:', error);
  }
};

const handleFileDelete = async (id) => {
  if (!noteRef.value.attachments) return;
  
  try {
    console.log('Deleting attachment:', id);
    // Call the store method to delete the attachment
    await notesStore.deleteAttachment(noteId, id);
    
    // Update local state
    noteRef.value = {
      ...noteRef.value,
      attachments: noteRef.value.attachments.filter(attachment => attachment.id !== id)
    };
  } catch (error) {
    console.error('Error deleting file:', error);
    // Here you might want to add some error handling UI feedback
  }
};

const handleFileDownload = async (url: string, filename: string, extension: string) => {
  try {
    // Fetch the file content from MinIO URL
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and ensure filename has extension
    const link = document.createElement('a');
    link.href = blobUrl;
    // Add extension if filename doesn't already have it
    const downloadFilename = filename.endsWith(`.${extension}`) 
      ? filename 
      : `${filename}.${extension}`;
    link.download = downloadFilename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Here you might want to add some error handling UI feedback
  }
};

// Replace the existing watch with this debounced version
watch(
  noteRef,
  debounce((newValue) => {
    if (!newValue.id) return

    // If this is the first change, store the initial state
    if (!previousNoteState.value) {
      previousNoteState.value = JSON.parse(JSON.stringify(newValue))
      return
    }

    // Compare relevant fields to check if there are actual changes
    const hasChanges = !isEqual(
      {
        title: previousNoteState.value?.title,
        content: previousNoteState.value?.content,
        isPinned: previousNoteState.value?.isPinned,
        attachments: previousNoteState.value?.attachments
      },
      {
        title: newValue.title,
        content: newValue.content,
        isPinned: newValue.isPinned,
        attachments: newValue.attachments
      }
    )

    if (hasChanges) {
      notesStore.updateNote({
        id: newValue.id,
        isPinned: newValue.isPinned,
        title: newValue.title,
        content: newValue.content,
        lastModified: new Date(),
      })
      
      // Update the previous state after saving
      previousNoteState.value = JSON.parse(JSON.stringify(newValue))
    }
  }, 500), // 500ms debounce delay
  { deep: true }
)

</script>
