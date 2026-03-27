import { Document } from "mongoose";

export interface IAttachment {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  extractedText?: string;
}

export interface IMessage extends Document {
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  attachments: IAttachment[];
  metadata?: {
    provider: string;
    model: string;
    tokensUsed?: number;
  };
  createdAt: Date;
}

export interface IConversation extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageRequest {
  content: string;
  attachments?: string[];
}

export interface SendMessageResponse {
  userMessage: IMessage;
  assistantMessage: IMessage;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}
