import { Router, Request, Response, NextFunction } from "express";
import {
  getMessagesByConversationId,
  createUserMessage,
  createAssistantMessage,
} from "../services/messageService";
import { generateResponse } from "../services/openaiService";
import { SendMessageRequest } from "../types";

const router = Router();

// Hardcoded conversation ID for single conversation app
const DEFAULT_CONVERSATION_ID = "default-conversation";

// Get all messages
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await getMessagesByConversationId(DEFAULT_CONVERSATION_ID);

    res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    next(error);
  }
});

// Send a message and get AI response
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, attachments = [] }: SendMessageRequest = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Get conversation history
    const conversationHistory = await getMessagesByConversationId(
      DEFAULT_CONVERSATION_ID,
    );

    // Use the received attachment data directly (includes extracted text)
    const attachmentData = attachments.map((att) => ({
      fileName: att.fileName,
      originalName: att.originalName,
      mimeType: att.mimeType,
      size: att.size,
      url: att.url,
      extractedText: att.extractedText,
    }));

    // Create user message
    const userMessage = await createUserMessage(
      DEFAULT_CONVERSATION_ID,
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
      DEFAULT_CONVERSATION_ID,
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
});

export default router;
