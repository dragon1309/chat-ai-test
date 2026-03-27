import mongoose, { Schema } from "mongoose";
import { IConversation } from "../types";

const conversationSchema = new Schema<IConversation>(
  {
    title: {
      type: String,
      required: true,
      default: "Default Conversation",
    },
  },
  {
    timestamps: true,
  },
);

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);

export default Conversation;
