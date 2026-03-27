import Message from "../models/Message";
import { IMessage, IAttachment } from "../types";

export async function getMessagesByConversationId(
  conversationId: string,
): Promise<IMessage[]> {
  return await Message.find({ conversationId }).sort({ createdAt: 1 }).exec();
}

export async function createUserMessage(
  conversationId: string,
  content: string,
  attachments: IAttachment[] = [],
): Promise<IMessage> {
  const message = new Message({
    conversationId,
    role: "user",
    content,
    attachments,
  });
  return await message.save();
}

export async function createAssistantMessage(
  conversationId: string,
  content: string,
  metadata?: { provider: string; model: string; tokensUsed?: number },
): Promise<IMessage> {
  const message = new Message({
    conversationId,
    role: "assistant",
    content,
    metadata,
  });
  return await message.save();
}

export default {
  getMessagesByConversationId,
  createUserMessage,
  createAssistantMessage,
};
