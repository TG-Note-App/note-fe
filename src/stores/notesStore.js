import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [
      {
        id: 1,
        title: 'Сегодняшняя заметка',
        text: 'Текст внутри заметкиewfjewjfiewjfiwejirjwejiewjrekwkrwekrjwekrjwelkrjlwejrlwejrwewkrewkrwkelrwk;;lrwellerjlwejr',
        lastModified: new Date('2025-02-13'),
        isPinned: true,
      },
      { id: 2, title: 'Вчерашняя заметка', text: 'Текст внутри заметки', lastModified: new Date('2025-02-12'), isPinned: false },
      { id: 3, title: 'Заметка 1', text: 'Текст внутри заметки', lastModified: new Date('2025-01-20'), isPinned: false },
      { id: 4, title: 'Заметка 2', text: 'Текст внутри заметки', lastModified: new Date('2025-01-20'), isPinned: false }
    ]
  }),
  getters: {
    filteredNotes: (state) => (searchTerm) => {
      const lowercaseSearch = searchTerm.toLowerCase();
      return lowercaseSearch
        ? state.notes.filter(note => 
            note.title.toLowerCase().includes(lowercaseSearch) || 
            note.text.toLowerCase().includes(lowercaseSearch)
          )
        : state.notes;
    }
  },
  actions: {
    addNote(note) {
      this.notes.push(note)
    },
    updateNote(updatedNote) {
      const index = this.notes.findIndex(note => note.id === updatedNote.id)
      if (index !== -1) {
        this.notes[index] = updatedNote
      }
    },
    deleteNote(noteId) {
      this.notes = this.notes.filter(note => note.id !== noteId)
    },
    togglePin(noteId) {
      const note = this.notes.find(note => note.id === noteId)
      if (note) {
        note.isPinned = !note.isPinned
      }
    }
  }
}) 