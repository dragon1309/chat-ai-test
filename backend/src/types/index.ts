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
  attachments?: IAttachment[];
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

export interface GenerateImageRequest {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
}

export interface GenerateImageResponse {
  imageUrl: string;
  revisedPrompt: string;
  metadata: {
    provider: string;
    model: string;
  };
}

export interface DescribeImageRequest {
  imageUrl: string;
  question?: string;
}

export interface DescribeImageResponse {
  description: string;
  metadata: {
    provider: string;
    model: string;
    tokensUsed?: number;
  };
}

export interface AIMode {
  mode: "chat" | "generate" | "describe";
}
