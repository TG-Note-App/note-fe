import { defineStore } from 'pinia'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [
      {
        id: 1,
        title: 'Сегодняшняя заметка',
        text: 'Текст внутри заметкиewfjewjfiewjfiwejirjwejiewjrekwkrwekrjwekrjwelkrjlwejrlwejrwewkrewkrwkelrwk;;lrwellerjlwejr',
        date: 'Сегодня',
        lastModified: new Date('2024-01-15T10:30:00'),
      },
      { id: 2, title: 'Вчерашняя заметка', text: 'Текст внутри заметки', date: 'Вчера', lastModified: new Date('2024-01-14T15:45:00') },
      { id: 3, title: 'Заметка 1', text: 'Текст внутри заметки', date: 'Предыдущие 30 дней', lastModified: new Date('2023-12-28T09:15:00') },
      { id: 4, title: 'Заметка 2', text: 'Текст внутри заметки', date: 'Предыдущие 30 дней', lastModified: new Date('2023-12-20T11:30:00') }
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
  }
}) 