import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const records = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    return res.json({ success: true, count: records.length, data: records });
  } catch {
    return res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const records = await Telemetry.find().sort({ timestamp: -1 }).limit(50);
    if (records.length === 0) {
      return res.json({
        success: true,
        stats: { totalRecords: 0, avgBattery: null, avgTemperature: null, latestStatus: "Offline" },
      });
    }

    const avg = (key) => {
      const vals = records.map((r) => r[key]).filter((v) => typeof v === "number");
      return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : null;
    };
    const latest = records[0];

    return res.json({
      success: true,
      stats: {
        totalRecords: records.length,
        avgBattery: avg("battery"),
        avgTemperature: avg("temperature"),
        latestStatus: latest.status,
        latestAltitude: latest.altitude,
        latestSpeed: latest.speed,
        latestBattery: latest.battery,
        latestTemperature: latest.temperature,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error calculating stats" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const record = await Telemetry.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    return res.json({ success: true, data: record });
  } catch {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { podId, battery, temperature, altitude, speed, status, source } = req.body;

    const toNum = (v) => (v === undefined || v === null || v === "" ? null : Number(v));
    const nums = { battery: toNum(battery), temperature: toNum(temperature), altitude: toNum(altitude), speed: toNum(speed) };

    if (nums.altitude === null || Object.values(nums).some((v) => v !== null && Number.isNaN(v))) {
      return res.status(400).json({ success: false, message: "Altitude is required and all readings must be numbers." });
    }

    let calcStatus = ["Nominal", "Warning", "Critical"].includes(status) ? status : "Unknown";
    if (nums.battery !== null && nums.battery < 25) calcStatus = "Critical";
    else if (nums.temperature !== null && nums.temperature > 60) calcStatus = "Critical";
    else if (nums.battery !== null && nums.battery < 50) calcStatus = "Warning";
    else if (nums.temperature !== null && nums.temperature > 40) calcStatus = "Warning";

    const newRecord = await Telemetry.create({
      podId: podId || "SomaiyaPod-01",
      ...nums,
      status: calcStatus,
      source: source || "Manual Entry",
      timestamp: new Date(),
    });

    return res.status(201).json({ success: true, message: "Saved successfully", data: newRecord });
  } catch {
    return res.status(500).json({ success: false, message: "Error saving record" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Telemetry.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Record deleted" });
  } catch {
    return res.status(500).json({ success: false, message: "Error deleting record" });
  }
});

export default router;
