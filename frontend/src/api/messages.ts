import apiClient from "./client";
import { Message, SendMessageData } from "../types";

export async function getMessages(): Promise<{ messages: Message[] }> {
  const response = await apiClient.get("/messages");
  return response.data;
}

export async function sendMessage(
  data: SendMessageData,
): Promise<{ userMessage: Message; assistantMessage: Message }> {
  const response = await apiClient.post("/messages", data);
  return {
    userMessage: response.data.userMessage,
    assistantMessage: response.data.assistantMessage,
  };
}

export default { getMessages, sendMessage };
