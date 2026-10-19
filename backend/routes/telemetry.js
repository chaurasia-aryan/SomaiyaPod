import express from "express";
import {
  getAllTelemetry,
  getTelemetryById,
  createTelemetry,
  getTelemetryStats,
  seedTelemetry,
  deleteTelemetry,
  getFileTelemetry,
} from "../controllers/telemetryController.js";

const router = express.Router();

// Basic Routes
router.get("/", getAllTelemetry);
router.post("/", createTelemetry);
router.get("/stats", getTelemetryStats);
router.post("/seed", seedTelemetry);
router.get("/file-based", getFileTelemetry);

// Dynamic Routes (with :id parameter)
router.get("/:id", getTelemetryById);
router.delete("/:id", deleteTelemetry);

export default router;
