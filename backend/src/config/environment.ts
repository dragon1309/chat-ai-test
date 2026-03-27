import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/ai-chat",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
};

// Validate required environment variables
if (!config.openaiApiKey) {
  console.warn(
    "⚠️  OPENAI_API_KEY is not set. Please add it to your .env file.",
  );
}

export default config;
