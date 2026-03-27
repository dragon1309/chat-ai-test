import Conversation from "../models/Conversation";
import { IConversation } from "../types";

export async function getAllConversations(): Promise<IConversation[]> {
  return await Conversation.find().sort({ createdAt: -1 }).exec();
}

export async function getConversationById(
  id: string,
): Promise<IConversation | null> {
  return await Conversation.findById(id).exec();
}

export async function createDefaultConversation(): Promise<IConversation> {
  const conversation = new Conversation({
    title: "Default Conversation",
  });
  return await conversation.save();
}

export async function ensureDefaultConversation(): Promise<IConversation> {
  const conversations = await getAllConversations();
  if (conversations.length === 0) {
    console.log("Creating default conversation...");
    return await createDefaultConversation();
  }
  return conversations[0];
}

export default {
  getAllConversations,
  getConversationById,
  createDefaultConversation,
  ensureDefaultConversation,
};
