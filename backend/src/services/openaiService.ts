import OpenAI from "openai";
import config from "../config/environment";
import { IMessage } from "../types";
import * as fs from "fs";
import * as path from "path";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

// Helper function to get MIME type from filename
function getMimeType(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
  };
  return mimeTypes[extension] || "application/octet-stream";
}

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

export interface DescribeImageOptions {
  imageUrl: string;
  question?: string;
}

export async function describeImage(options: DescribeImageOptions): Promise<{
  description: string;
  metadata: { provider: string; model: string; tokensUsed?: number };
}> {
  const { imageUrl, question } = options;

  const defaultQuestion = "Describe this image in detail.";

  try {
    // Convert local file URLs to base64 data URLs
    let processedImageUrl = imageUrl;

    if (
      imageUrl.startsWith("http://localhost") ||
      imageUrl.startsWith("http://127.0.0.1")
    ) {
      // Extract filename from URL
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        const filePath = path.join(config.uploadDir, fileName);

        // Check if file exists and read it
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const mimeType = getMimeType(fileName);
          const base64Data = fileBuffer.toString("base64");
          processedImageUrl = `data:${mimeType};base64,${base64Data}`;
          console.log(`Converted local image to base64: ${fileName}`);
        } else {
          throw new Error(`Local file not found: ${filePath}`);
        }
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // GPT-4 with vision support
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: question || defaultQuestion,
            },
            {
              type: "image_url",
              image_url: {
                url: processedImageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const description =
      response.choices[0]?.message?.content ||
      "I could not analyze this image.";
    const tokensUsed = response.usage?.total_tokens;

    return {
      description,
      metadata: {
        provider: "openai",
        model: response.model,
        tokensUsed,
      },
    };
  } catch (error: any) {
    console.error("OpenAI Vision API error:", error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}

export interface GenerateImageOptions {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  n?: number;
}

export async function generateImage(options: GenerateImageOptions): Promise<{
  imageUrl: string;
  revisedPrompt: string;
  metadata: { provider: string; model: string };
}> {
  const { prompt, size = "1024x1024", quality = "standard", n = 1 } = options;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3", // Using DALL-E 3 for higher quality
      prompt,
      n,
      size,
      quality,
      response_format: "url",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No image data returned from DALL-E");
    }

    const imageData = response.data[0];
    if (!imageData.url) {
      throw new Error("No image URL returned from DALL-E");
    }

    return {
      imageUrl: imageData.url,
      revisedPrompt: imageData.revised_prompt || prompt,
      metadata: {
        provider: "openai",
        model: "dall-e-3",
      },
    };
  } catch (error: any) {
    console.error("DALL-E API error:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

export default { generateResponse, describeImage, generateImage };
