export interface Attachment {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  extractedText?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  attachments: Attachment[];
  metadata?: {
    provider: string;
    model: string;
    tokensUsed?: number;
  };
  createdAt: string;
}

export interface Conversation {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  content: string;
  attachments?: string[];
}

export interface UploadedFile {
  fileId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  file?: File;
}
