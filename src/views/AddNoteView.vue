<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black">
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
  import { ref, watch, provide } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNotesStore } from '../stores/notesStore'
  import NoteEditor from '../components/note/NoteEditor.vue'
  import NoteToolbar from '../components/note/NoteToolbar.vue'
  import type { Note } from '../types/note'

  const notesStore = useNotesStore()
  const router = useRouter()

  const noteRef = ref<Note>({
    id: null,
    title: '',
    content: '',
    lastModified: new Date(),
    attachments: []
  })

  // Add a flag to track if note was created
  const isNoteCreated = ref(false)

  // Modify watch to handle both creation and updates
  watch(noteRef, (newValue) => {
    if (!isNoteCreated.value && (newValue.title || newValue.content)) {
      // Create new note on first edit
      const newNote = {
        ...noteRef.value,
        id: notesStore.notes.length ? Math.max(...notesStore.notes.map(note => Number(note.id))) + 1 : 1,
        lastModified: new Date(),
        attachments: []
      }
      notesStore.addNote(newNote)
      noteRef.value.id = newNote.id
      isNoteCreated.value = true
    } else if (isNoteCreated.value && noteRef.value.id) {
      // Update existing note
      notesStore.updateNote({
        ...noteRef.value,
        title: newValue.title,
        content: newValue.content,
        lastModified: new Date(),
        attachments: newValue.attachments
      })
    }
  }, { deep: true })

  // Remove or modify saveNote function since it's handled by the watcher
  const handleBackClick = () => {
    // No need to save here as it's handled by the watcher
    router.push('/notes')
  }

  // Add delete handler
  const handleDelete = () => {
    if (noteRef.value.id) {
      notesStore.deleteNote(noteRef.value.id)
    }
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
        if (!noteRef.value.id) {
          const newNote = {
            ...noteRef.value,
            id: notesStore.notes.length ? Math.max(...notesStore.notes.map(note => Number(note.id))) + 1 : 1,
            lastModified: new Date(),
            attachments: []
          }
          notesStore.addNote(newNote)
          noteRef.value.id = newNote.id
          isNoteCreated.value = true
        }
        
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
    await notesStore.deleteAttachment(noteRef.value.id, id);
    
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

  // Provide the method to NoteToolbar
  provide('onBackClick', handleBackClick)
  </script>
  
  <style>
  /* Move to global styles or separate style file */
  </style> 