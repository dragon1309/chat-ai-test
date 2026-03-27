import { useState, useEffect } from "react";
import { Message, AIMode, GeneratedImage, ImageDescription } from "../types";
import { getMessages, sendMessage as sendMessageAPI } from "../api/messages";
import { generateImage, describeImage } from "../api/images";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<AIMode>("chat");

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { messages: msgs } = await getMessages();
      setMessages(msgs);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const sendMessage = async (content: string, attachments?: any[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const { userMessage, assistantMessage } = await sendMessageAPI({
        content,
        attachments,
      });

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (
    prompt: string,
  ): Promise<GeneratedImage | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateImage({
        prompt,
      });

      // Use saved messages from backend
      if (result.userMessage && result.assistantMessage) {
        const userMsg = result.userMessage;
        const assistantMsg = result.assistantMessage;
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
      } else {
        // Fallback: Create user message with the prompt
        const userMessage: Message = {
          _id: `user-${Date.now()}`,
          conversationId: "default-conversation",
          role: "user",
          content: prompt,
          attachments: [],
          createdAt: new Date().toISOString(),
          type: "text",
        };

        // Create assistant message with the generated image
        const assistantMessage: Message = {
          _id: `assistant-${Date.now()}`,
          conversationId: "default-conversation",
          role: "assistant",
          content: `Here's the image generated from your prompt: "${result.revisedPrompt}"`,
          attachments: [],
          createdAt: new Date().toISOString(),
          type: "image",
          imageUrl: result.imageUrl,
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescribeImage = async (
    imageUrl: string,
    question?: string,
  ): Promise<ImageDescription | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await describeImage({
        imageUrl,
        question,
      });

      // Use saved messages from backend
      if (result.userMessage && result.assistantMessage) {
        const userMsg = result.userMessage;
        const assistantMsg = result.assistantMessage;
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
      } else {
        // Fallback: Create user message with the image
        const userMessage: Message = {
          _id: `user-${Date.now()}`,
          conversationId: "default-conversation",
          role: "user",
          content: question || "Describe this image",
          attachments: [],
          createdAt: new Date().toISOString(),
          type: "image",
          imageUrl,
        };

        // Create assistant message with the description
        const assistantMessage: Message = {
          _id: `assistant-${Date.now()}`,
          conversationId: "default-conversation",
          role: "assistant",
          content: result.description,
          attachments: [],
          createdAt: new Date().toISOString(),
          type: "text",
          metadata: result.metadata,
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    aiMode,
    setAiMode,
    sendMessage,
    generateImage: handleGenerateImage,
    describeImage: handleDescribeImage,
  };
}

export default useChat;
