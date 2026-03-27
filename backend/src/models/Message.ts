import mongoose, { Schema } from "mongoose";
import { IMessage, IAttachment } from "../types";

const attachmentSchema = new Schema<IAttachment>(
  {
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    extractedText: { type: String },
  },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"],
    },
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    metadata: {
      provider: String,
      model: String,
      tokensUsed: Number,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Index for efficient queries
messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
