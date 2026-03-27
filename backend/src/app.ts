import express from "express";
import cors from "cors";
import path from "path";
import config from "./config/environment";
import conversationsRouter from "./routes/conversations";
import messagesRouter from "./routes/messages";
import uploadsRouter from "./routes/uploads";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", config.uploadDir)),
);

// Routes
app.use("/api/conversations", conversationsRouter);
app.use("/api/conversations", messagesRouter);
app.use("/api/uploads", uploadsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

export default app;
