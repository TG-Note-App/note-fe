import { defineStore } from "pinia";
import { Buffer } from "buffer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useNotesStore = defineStore("notes", {
  state: () => ({
    notes: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    filteredNotes: (state) => (searchTerm) => {
      const lowercaseSearch = searchTerm?.toLowerCase() || "";
      return lowercaseSearch
        ? state.notes.filter(
            (note) =>
              (note.title?.toLowerCase() || "").includes(lowercaseSearch) ||
              (note.content?.toLowerCase() || "").includes(lowercaseSearch)
          )
        : state.notes;
    },
  },
  actions: {
    async deleteAttachment(noteId, attachmentId) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/notes/${noteId}/delete-file`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ attachmentId }),
          }
        );

        console.log(
          "Deleting attachment!!!:",
          JSON.stringify({ attachmentId })
        );

        if (!response.ok) throw new Error("Failed to delete attachment");

        // Update the note's attachments in the store
        const noteIndex = this.notes.findIndex((note) => note.id === noteId);
        if (noteIndex !== -1) {
          this.notes[noteIndex].attachments = this.notes[
            noteIndex
          ].attachments.filter((attachment) => attachment.id !== attachmentId);
        }
      } catch (err) {
        this.error = err.message;
        console.error("Error deleting attachment:", err);
        throw err;
      }
    },
    async uploadAttachment(noteId, attachment) {
      try {
        // Convert base64 to blob
        const base64Response = await fetch(attachment.url);
        const blob = await base64Response.blob();

        // Create FormData
        const formData = new FormData();
        formData.append("file", blob, attachment.filename);
        formData.append("noteId", noteId);

        const response = await fetch(
          `${BACKEND_URL}/notes/${noteId}/upload-file`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Failed to upload attachment");

        const savedAttachment = await response.json();

        // Update the note's attachments in the store
        const noteIndex = this.notes.findIndex((note) => note.id === noteId);
        if (noteIndex !== -1) {
          // Initialize attachments array if it doesn't exist
          if (!this.notes[noteIndex].attachments) {
            this.notes[noteIndex].attachments = [];
          }

          const updatedAttachments = [...this.notes[noteIndex].attachments];
          // Replace the temporary attachment with the saved one
          const attachmentIndex = updatedAttachments.findIndex(
            (a) => a.id === attachment.id
          );
          if (attachmentIndex !== -1) {
            updatedAttachments[attachmentIndex] = savedAttachment;
          } else {
            updatedAttachments.push(savedAttachment);
          }
          this.notes[noteIndex].attachments = updatedAttachments;
        }

        return savedAttachment;
      } catch (err) {
        this.error = err.message;
        console.error("Error uploading attachment:", err);
        throw err;
      }
    },
    async fetchNotes(userId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${BACKEND_URL}/notes?userId=${userId}`);
        console.log(response);
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        console.log(data);
        // Convert date strings to Date objects and ensure isPinned is boolean
        this.notes = data.map((note) => ({
          ...note,
          lastModified: new Date(note.lastModified),
          isPinned: Boolean(note.isPinned), // Ensure isPinned is properly converted to boolean
        }));

        console.log(this.notes);
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching notes:", err);
      } finally {
        this.isLoading = false;
      }
    },
    async addNote(request) {
      try {
        console.log("request", JSON.stringify(request));
        const response = await fetch(`${BACKEND_URL}/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) throw new Error("Failed to add note");

        // Check if there's actually JSON content to parse
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const resp = await response.json();
          note.id = resp.id;
          this.notes.push(note);
          return resp.id;
        }
      } catch (err) {
        this.error = err.message;
        console.error("Error adding note:", err);
        throw err;
      }
    },
    async updateNote(updatedNote) {
      try {
        // Handle attachments first if there are any new ones
        if (updatedNote.attachments) {
          const existingNote = this.notes.find(
            (note) => note.id === updatedNote.id
          );
          const newAttachments = updatedNote.attachments.filter(
            (attachment) =>
              !existingNote?.attachments?.find((a) => a.id === attachment.id)
          );

          // Upload new attachments
          for (const attachment of newAttachments) {
            await this.uploadAttachment(updatedNote.id, attachment);
          }
        }

        // Continue with existing update logic
        updatedNote.id = parseInt(updatedNote.id);
        const response = await fetch(`${BACKEND_URL}/notes/${updatedNote.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNote),
        });

        console.log(response);
        if (!response.ok) throw new Error("Failed to update note");

        // Otherwise, try to parse the response as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const savedNote = await response.json();
          const index = this.notes.findIndex(
            (note) => note.id === updatedNote.id
          );
          if (index !== -1) {
            this.notes[index] = savedNote;
          }
        } else {
          // If server responds with success but no JSON, use the updatedNote
          const index = this.notes.findIndex(
            (note) => note.id === updatedNote.id
          );
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
        }
      } catch (err) {
        this.error = err.message;
        console.error("Error updating note:", err);
        throw err;
      }
    },
    async deleteNote(noteId) {
      try {
        const response = await fetch(`${BACKEND_URL}/notes/${noteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to delete note");

        this.notes = this.notes.filter((note) => note.id !== noteId);
      } catch (err) {
        this.error = err.message;
        console.error("Error deleting note:", err);
        throw err;
      }
    },
    async togglePin(noteId) {
      try {
        const noteIndex = this.notes.findIndex((note) => note.id === noteId);
        if (noteIndex === -1) return;

        // Toggle the pin status immediately for better UX
        this.notes[noteIndex].isPinned = !this.notes[noteIndex].isPinned;

        const response = await fetch(
          `${BACKEND_URL}/notes/${noteId}/toggle-pin`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isPinned: this.notes[noteIndex].isPinned }),
          }
        );

        if (!response.ok) {
          // Revert the change if the server request fails
          this.notes[noteIndex].isPinned = !this.notes[noteIndex].isPinned;
          throw new Error("Failed to update pin status");
        }
      } catch (err) {
        this.error = err.message;
        console.error("Error updating pin status:", err);
        throw err;
      }
    },
    async fetchNoteById(noteId) {
      try {
        const response = await fetch(`${BACKEND_URL}/notes/${noteId}`);
        if (!response.ok) throw new Error("Failed to fetch note");

        const note = await response.json();
        // Convert date strings to Date objects and ensure isPinned is boolean
        const processedNote = {
          id: note.id,
          title: note.title,
          content: note.content,
          attachments: note.attachments,
          lastModified: new Date(note.lastModified),
          isPinned: Boolean(note.isPinned),
        };

        // Update the note in the store if it exists
        const noteIndex = this.notes.findIndex((n) => n.id === noteId);
        if (noteIndex !== -1) {
          this.notes[noteIndex] = processedNote;
        } else {
          this.notes.push(processedNote);
        }

        return processedNote;
      } catch (err) {
        this.error = err.message;
        console.error("Error fetching note:", err);
        throw err;
      }
    },
  },
});
