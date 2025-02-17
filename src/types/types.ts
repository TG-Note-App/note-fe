export interface NoteToolbarProps {
  noteTitle?: string
  noteContent?: string
  noteId?: number
  searchMatchCount?: number
  isNewNotePage?: boolean
}

export interface ActionButton {
  title: string
  icon: string
  handler: () => void
}
