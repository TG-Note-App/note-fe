export interface Note {
  id: string | null
  title: string
  content: string
  lastModified: Date
  attachments: Attachment[]
} 

export interface Attachment {
  id: string | null
  filename: string
  extension: string
  size: number
  url: string
} 