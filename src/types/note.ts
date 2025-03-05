export interface Note {
  id: string | null;
  title: string;
  content: string;
  lastModified: Date;
  attachments: Attachment[];
  isPinned: boolean;
  userId: number | null;
  tgHash: string | null;
}

export interface Attachment {
  id: string;
  filename: string;
  extension: string;
  size: number;
  url: string;
}
