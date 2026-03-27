import apiClient from "./client";
import { Message } from "../types";

export interface GenerateImageData {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  conversationId?: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  revisedPrompt: string;
  metadata: {
    provider: string;
    model: string;
  };
  userMessage?: Message;
  assistantMessage?: Message;
}

export interface DescribeImageData {
  imageUrl: string;
  question?: string;
  conversationId?: string;
}

export interface DescribeImageResponse {
  description: string;
  metadata: {
    provider: string;
    model: string;
    tokensUsed?: number;
  };
  userMessage?: Message;
  assistantMessage?: Message;
}

export async function generateImage(
  data: GenerateImageData,
): Promise<GenerateImageResponse> {
  const response = await apiClient.post("/images/generate", data);
  return response.data;
}

export async function describeImage(
  data: DescribeImageData,
): Promise<DescribeImageResponse> {
  const response = await apiClient.post("/images/describe", data);
  return response.data;
}

export default { generateImage, describeImage };
