import { Router, Request, Response, NextFunction } from "express";
import { generateImage, describeImage } from "../services/openaiService";
import {
  createUserMessage,
  createAssistantMessage,
} from "../services/messageService";
import { GenerateImageRequest, DescribeImageRequest } from "../types";
import path from "path";

const router = Router();

// Hardcoded conversation ID for single conversation app
const DEFAULT_CONVERSATION_ID = "default-conversation";

// Generate image from text prompt
router.post(
  "/generate",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt, size, quality }: GenerateImageRequest = req.body;

      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Prompt is required for image generation",
        });
      }

      const result = await generateImage({
        prompt,
        size: size || "1024x1024",
        quality: quality || "standard",
        n: 1,
      });

      // Create user message with the prompt
      const userMessage = await createUserMessage(
        DEFAULT_CONVERSATION_ID,
        prompt,
        [],
      );

      // Create assistant message with the generated image
      const assistantMessage = await createAssistantMessage(
        DEFAULT_CONVERSATION_ID,
        `Here's the image generated from your prompt: "${result.revisedPrompt}"`,
        { provider: "openai", model: "dall-e-3" },
      );

      return res.json({
        success: true,
        data: {
          ...result,
          userMessage,
          assistantMessage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Describe an uploaded image
router.post(
  "/describe",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageUrl, question }: DescribeImageRequest = req.body;

      if (!imageUrl || imageUrl.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Image URL is required for image description",
        });
      }

      const result = await describeImage({
        imageUrl,
        question,
      });

      // Create user message with the image
      const attachmentData = imageUrl.includes("/uploads/")
        ? [
            {
              fileName: imageUrl.split("/").pop() || "uploaded-image",
              originalName: imageUrl.split("/").pop() || "uploaded-image",
              mimeType: getMimeType(imageUrl),
              size: 0,
              url: imageUrl,
            },
          ]
        : [];

      const userMessage = await createUserMessage(
        DEFAULT_CONVERSATION_ID,
        question || "Describe this image",
        attachmentData,
      );

      // Create assistant message with the description
      const assistantMessage = await createAssistantMessage(
        DEFAULT_CONVERSATION_ID,
        result.description,
        result.metadata,
      );

      return res.json({
        success: true,
        data: {
          ...result,
          userMessage,
          assistantMessage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Helper function to get MIME type from URL
function getMimeType(url: string): string {
  const extension = path.extname(url).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[extension] || "image/jpeg";
}

export default router;
