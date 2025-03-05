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
import { ref, watch, provide, onMounted } from "@vue/runtime-dom";
import { useRouter } from "vue-router";
import { useNotesStore } from "../stores/notesStore";
import NoteEditor from "../components/note/NoteEditor.vue";
import NoteToolbar from "../components/note/NoteToolbar.vue";
import type { Note, TelegramInitData } from "../types/note";

const notesStore = useNotesStore();
const router = useRouter();

const dataUrl = ref<[string, string]>(["", ""]);
const noteRef = ref<Note>({
  id: null,
  title: "",
  content: "",
  lastModified: new Date(),
  attachments: [],
  isPinned: false,
  userId: null,
});

const telegramInitDataRef = ref<TelegramInitData>({
  userId: 0,
  hash: "",
  authDate: 0,
  queryId: "",
  signature: "",
});

// Add a flag to track if note was created
const isNoteCreated = ref(false);

// Remove or modify saveNote function since it's handled by the watcher
const handleBackClick = async () => {
  try {
    if (
      noteRef.value.title ||
      noteRef.value.content ||
      noteRef.value.attachments?.length > 0
    ) {
      if (!noteRef.value.id) {
        // If it's a new note, add it
        const resp = await notesStore.addNote({
          title: noteRef.value.title + "!!!!",
          content: noteRef.value.content,
          attachments: noteRef.value.attachments,
          userId: noteRef.value.userId,
        });
        noteRef.value.id = resp.id;
      } else {
        // If it's an existing note, update it
        await notesStore.updateNote({
          ...noteRef.value,
          lastModified: new Date(),
        });
      }
    }
    router.push("/notes");
  } catch (error) {
    console.error("Error saving note:", error);
    // You might want to add some error handling UI feedback here
  }
};

// Add delete handler
const handleDelete = () => {
  if (noteRef.value.id) {
    notesStore.deleteNote(noteRef.value.id);
  }
  router.push("/notes");
};

// Add this function to handle file selection
const handleFileSelected = async (
  files: Array<{
    file: File;
    filename: string;
    ext: string;
    size: number;
  }>
) => {
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
          extension: ext.toLowerCase().replace(/^\./, ""),
          size: size,
          url: url,
        };

        // For debugging
        console.log("Created temp attachment:", tempAttachment);

        // Upload the attachment and get the saved version from backend
        if (!noteRef.value.id) {
          const newNote = {
            ...noteRef.value,
            attachments: [],
            userId: noteRef.value.userId,
          };
          const id = await notesStore.addNote(newNote);
          noteRef.value.id = id;
          isNoteCreated.value = true;
        }

        if (noteRef.value.id) {
          const savedAttachment = await notesStore.uploadAttachment(
            parseInt(noteRef.value.id),
            tempAttachment
          );
          console.log("Saved attachment:", savedAttachment);
          return savedAttachment;
        }
        return tempAttachment;
      })
    );

    const newAttachments = await Promise.all(filePromises);
    console.log("New attachments:", newAttachments);

    noteRef.value = {
      ...noteRef.value,
      attachments: [...(noteRef.value.attachments || []), ...newAttachments],
    };
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};

const handleFileDelete = async (id) => {
  if (!noteRef.value.attachments) return;

  try {
    console.log("Deleting attachment:", id);
    // Call the store method to delete the attachment
    await notesStore.deleteAttachment(noteRef.value.id, id);

    // Update local state
    noteRef.value = {
      ...noteRef.value,
      attachments: noteRef.value.attachments.filter(
        (attachment) => attachment.id !== id
      ),
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    // Here you might want to add some error handling UI feedback
  }
};

const handleFileDownload = async (
  url: string,
  filename: string,
  extension: string
) => {
  try {
    // Fetch the file content from MinIO URL
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    // Get the blob from the response
    const blob = await response.blob();

    // Create a URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and ensure filename has extension
    const link = document.createElement("a");
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
    console.error("Error downloading file:", error);
    // Here you might want to add some error handling UI feedback
  }
};

// Provide the method to NoteToolbar
provide("onBackClick", handleBackClick);
onMounted(() => {
  // Handle case where Telegram WebApp is not available
  const tgApp = (window as any).Telegram?.WebApp;
  if (!tgApp) {
    console.warn("Telegram WebApp is not available");
    return;
  }

  // Подготовка к получению данных
  tgApp.ready();

  noteRef.value.userId = tgApp?.initDataUnsafe?.user?.id ?? 0;
});
</script>
