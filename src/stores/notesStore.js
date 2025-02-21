import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [],
    isLoading: false,
    error: null
  }),
  getters: {
    filteredNotes: (state) => (searchTerm) => {
      const lowercaseSearch = searchTerm?.toLowerCase() || '';
      return lowercaseSearch
        ? state.notes.filter(note => 
            (note.title?.toLowerCase() || '').includes(lowercaseSearch) || 
            (note.content?.toLowerCase() || '').includes(lowercaseSearch)
          )
        : state.notes;
    }
  },
  actions: {
    async fetchNotes() {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('http://localhost:8080/notes')
        if (!response.ok) throw new Error('Failed to fetch notes')
        const data = await response.json()
        // Convert date strings to Date objects and ensure isPinned is boolean
        this.notes = data.map(note => ({
          ...note,
          lastModified: new Date(note.lastModified),
          isPinned: Boolean(note.isPinned) // Ensure isPinned is properly converted to boolean
        }))
        console.log(this.notes)
      } catch (err) {
        this.error = err.message
        console.error('Error fetching notes:', err)
      } finally {
        this.isLoading = false
      }
    },
    async addNote(note) {
      try {
        const response = await fetch('http://localhost:8080/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        })
        
        if (!response.ok) throw new Error('Failed to add note')

        // Check if there's actually JSON content to parse
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const savedNote = await response.json()
          this.notes.push(savedNote)
        } else {
          // If no JSON response, use the original note with a generated ID
          const newNote = {
            ...note,
            id: Date.now(), // Temporary ID if server doesn't provide one
            lastModified: new Date()
          }
          this.notes.push(newNote)
        }
      } catch (err) {
        this.error = err.message
        console.error('Error adding note:', err)
        throw err
      }
    },
    async updateNote(updatedNote) {
      try {
        console.log(JSON.stringify(updatedNote))
        const response = await fetch(`http://localhost:8080/notes/${updatedNote.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedNote)
        })
        console.log(response)
        if (!response.ok) throw new Error('Failed to update note')

        // Otherwise, try to parse the response as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const savedNote = await response.json();
          const index = this.notes.findIndex(note => note.id === updatedNote.id)
          if (index !== -1) {
            this.notes[index] = savedNote;
          }
        } else {
          // If server responds with success but no JSON, use the updatedNote
          const index = this.notes.findIndex(note => note.id === updatedNote.id)
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
        }
      } catch (err) {
        this.error = err.message
        console.error('Error updating note:', err)
        throw err
      }
    },
    async deleteNote(noteId) {
      try {
        const response = await fetch(`http://localhost:8080/notes/${noteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to delete note')
        
        this.notes = this.notes.filter(note => note.id !== noteId)
      } catch (err) {
        this.error = err.message
        console.error('Error deleting note:', err) 
        throw err
      }
    },
    async togglePin(noteId) {
      try {
        const noteIndex = this.notes.findIndex(note => note.id === noteId)
        if (noteIndex === -1) return

        // Toggle the pin status immediately for better UX
        this.notes[noteIndex].isPinned = !this.notes[noteIndex].isPinned
        
        const response = await fetch(`http://localhost:8080/notes/${noteId}/toggle-pin`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isPinned: this.notes[noteIndex].isPinned })
        })

        if (!response.ok) {
          // Revert the change if the server request fails
          this.notes[noteIndex].isPinned = !this.notes[noteIndex].isPinned
          throw new Error('Failed to update pin status')
        }

      } catch (err) {
        this.error = err.message
        console.error('Error updating pin status:', err)
        throw err
      }
    }
  }
}) 