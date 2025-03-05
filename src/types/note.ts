export interface Note {
  id: string | null;
  title: string;
  content: string;
  lastModified: Date;
  attachments: Attachment[];
  isPinned: boolean;
  userId: number | null;
}

export interface NoteRequest {
  title: string;
  content: string;
  attachments: Attachment[];
  telegramInitData: TelegramInitData;
}

export interface TelegramInitData {
  authDate: number;
  userId: number;
  queryId: string;
  hash: string;
}

export interface Attachment {
  id: string;
  filename: string;
  extension: string;
  size: number;
  url: string;
}
