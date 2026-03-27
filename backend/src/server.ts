import app from "./app";
import config from "./config/environment";
import { connectDatabase } from "./config/database";
import { ensureDefaultConversation } from "./services/conversationService";

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Ensure default conversation exists
    const defaultConversation = await ensureDefaultConversation();
    console.log(`✓ Default conversation ready: ${defaultConversation._id}`);

    // Start server
    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ API available at http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
