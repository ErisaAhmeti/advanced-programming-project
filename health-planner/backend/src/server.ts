import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";

// Import routes
import userRoutes from "./routes/users";
import goalRoutes from "./routes/goals";
import progressRoutes from "./routes/progress";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------
// Middleware
// ----------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[v0] ${req.method} ${req.path}`);
  next();
});

// ----------------------
// Health check endpoint
// ----------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Health Planner API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ----------------------
// API Routes
// ----------------------
app.use("/api/users", userRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/progress", progressRoutes);

// ----------------------
// 404 handler
// ----------------------
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ----------------------
// Error handling middleware
// ----------------------
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[v0] Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// ----------------------
// Start server
// ----------------------
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log(`[v0] Health Planner API server running on port ${PORT}`);
      console.log(`[v0] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[v0] Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
    });
  } catch (error) {
    console.error("[v0] Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
