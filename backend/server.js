import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/auth.js";
import telemetryRoutes from "./routes/telemetry.js";
import externalRoutes from "./routes/externalApi.js";
import aiRoutes from "./routes/ai.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/somaiyapod";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/external", externalRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "SomaiyaPod Mission Control Backend is running!",
    database: mongoose.connection.readyState === 1 ? "Connected to MongoDB" : "Disconnected",
    timestamp: new Date(),
  });
});

// Connect to MongoDB & Start Server
async function startServer() {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Successfully connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`🚀 SomaiyaPod Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️ Starting server in standalone mode...");
    
    app.listen(PORT, () => {
      console.log(`🚀 SomaiyaPod Backend running on http://localhost:${PORT} (without MongoDB)`);
    });
  }
}

startServer();
