import OpenAI from "openai";
import config from "../config/environment";
import { IMessage } from "../types";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export interface GenerateResponseOptions {
  userMessage: string;
  conversationHistory: IMessage[];
  extractedText?: string;
}

export async function generateResponse(
  options: GenerateResponseOptions,
): Promise<{
  content: string;
  metadata: { provider: string; model: string; tokensUsed?: number };
}> {
  const { userMessage, conversationHistory, extractedText } = options;

  // Build messages array for OpenAI
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
    },
    // Add conversation history
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    // Add current user message with extracted text if available
    {
      role: "user" as const,
      content: extractedText
        ? `${userMessage}\n\n[Attached file content]:\n${extractedText}`
        : userMessage,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseContent =
      completion.choices[0]?.message?.content ||
      "I apologize, but I could not generate a response.";
    const tokensUsed = completion.usage?.total_tokens;

    return {
      content: responseContent,
      metadata: {
        provider: "openai",
        model: completion.model,
        tokensUsed,
      },
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
}

export default { generateResponse };
