import { Router, Request, Response, NextFunction } from "express";
import {
  getMessagesByConversationId,
  createUserMessage,
  createAssistantMessage,
} from "../services/messageService";
import { generateResponse } from "../services/openaiService";
import { SendMessageRequest } from "../types";
import path from "path";
import config from "../config/environment";

const router = Router();

// Get messages for a conversation
router.get(
  "/:conversationId/messages",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const messages = await getMessagesByConversationId(conversationId);

      res.json({
        success: true,
        data: { messages },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Send a message and get AI response
router.post(
  "/:conversationId/messages",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const { content, attachments = [] }: SendMessageRequest = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }

      // Get conversation history
      const conversationHistory =
        await getMessagesByConversationId(conversationId);

      // Process attachments - they should already be uploaded and contain extracted text
      const attachmentData = attachments.map((fileName) => {
        // In a real scenario, we'd fetch the attachment data from storage
        // For now, we'll construct the attachment object
        const filePath = path.join(config.uploadDir, fileName);
        return {
          fileName,
          originalName: fileName,
          mimeType: "application/octet-stream", // This should be stored during upload
          size: 0,
          url: `/uploads/${fileName}`,
        };
      });

      // Create user message
      const userMessage = await createUserMessage(
        conversationId,
        content,
        attachmentData,
      );

      // Collect extracted text from attachments
      const extractedTexts = userMessage.attachments
        .filter((att) => att.extractedText)
        .map((att) => att.extractedText)
        .join("\n\n");

      // Generate AI response
      const aiResponse = await generateResponse({
        userMessage: content,
        conversationHistory,
        extractedText: extractedTexts || undefined,
      });

      // Create assistant message
      const assistantMessage = await createAssistantMessage(
        conversationId,
        aiResponse.content,
        aiResponse.metadata,
      );

      res.json({
        success: true,
        data: {
          userMessage,
          assistantMessage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
