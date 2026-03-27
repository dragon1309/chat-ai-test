import { Router, Request, Response, NextFunction } from "express";
import { getAllConversations } from "../services/conversationService";

const router = Router();

// Get all conversations
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversations = await getAllConversations();

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
