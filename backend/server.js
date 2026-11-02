import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

import authRoutes from "./routes/auth.js";
import telemetryRoutes from "./routes/telemetry.js";
import externalRoutes from "./routes/externalApi.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/external", externalRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    project: "SomaiyaPod Mission Control Ground Station API",
    status: "online",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      telemetry: "/api/telemetry",
      external: "/api/external",
      ai: "/api/ai",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    uptime: Math.round(process.uptime()),
    message: "SomaiyaPod Mission Control Backend is running!",
  });
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
