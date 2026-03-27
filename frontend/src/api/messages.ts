import apiClient from './client';
import { Message, SendMessageData } from '../types';

export async function getMessages(conversationId: string): Promise<{ messages: Message[] }> {
  return apiClient.get(`/conversations/${conversationId}/messages`);
}

export async function sendMessage(
  conversationId: string,
  data: SendMessageData
): Promise<{ userMessage: Message; assistantMessage: Message }> {
  return apiClient.post(`/conversations/${conversationId}/messages`, data);
}

export default { getMessages, sendMessage };
