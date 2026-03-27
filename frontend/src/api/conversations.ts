import apiClient from "./client";
import { Conversation } from "../types";

export async function getConversations(): Promise<{
  conversations: Conversation[];
}> {
  return apiClient.get("/conversations");
}

export default { getConversations };
