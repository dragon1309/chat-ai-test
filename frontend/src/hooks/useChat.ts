import { useState, useEffect } from "react";
import { Message } from "../types";
import { getConversations } from "../api/conversations";
import { getMessages, sendMessage as sendMessageAPI } from "../api/messages";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load conversation and messages on mount
  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation = async () => {
    try {
      const { conversations } = await getConversations();
      if (conversations && conversations.length > 0) {
        const conv = conversations[0];
        setConversationId(conv._id);
        await loadMessages(conv._id);
      } else {
        setConversationId("1");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const { messages: msgs } = await getMessages(convId);
      setMessages(msgs);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const sendMessage = async (content: string, attachments?: string[]) => {
    if (!conversationId) {
      setError("No conversation available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { userMessage, assistantMessage } = await sendMessageAPI(
        conversationId,
        {
          content,
          attachments,
        },
      );

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    conversationId,
    isLoading,
    error,
    sendMessage,
  };
}

export default useChat;
