import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

// 1. GET ALL TELEMETRY (Read)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const records = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    return res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

// 2. GET SINGLE RECORD BY ID (Dynamic route: /:id)
router.get("/:id", async (req, res) => {
  try {
    const record = await Telemetry.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }
});

// 3. CREATE NEW TELEMETRY (Create)
router.post("/", async (req, res) => {
  try {
    const { podId, battery, temperature, altitude, speed, status, source } = req.body;

    let calcStatus = status || "Nominal";
    if (battery < 25 || temperature > 60) {
      calcStatus = "Critical";
    } else if (battery < 50 || temperature > 40) {
      calcStatus = "Warning";
    }

    const newRecord = new Telemetry({
      podId: podId || "SomaiyaPod-01",
      battery: Number(battery) || 85,
      temperature: Number(temperature) || 24,
      altitude: Number(altitude) || 500,
      speed: Number(speed) || 27500,
      status: calcStatus,
      source: source || "Manual Entry",
      timestamp: new Date(),
    });

    await newRecord.save();
    return res.status(201).json({ success: true, message: "Saved successfully", data: newRecord });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error saving record" });
  }
});

// 4. GET STATS / AVERAGES
router.get("/stats", async (req, res) => {
  try {
    const records = await Telemetry.find().sort({ timestamp: -1 }).limit(50);
    if (records.length === 0) {
      return res.json({
        success: true,
        stats: { totalRecords: 0, avgBattery: 0, avgTemperature: 0, latestStatus: "Offline" },
      });
    }

    const total = records.length;
    const avgBatt = (records.reduce((acc, r) => acc + r.battery, 0) / total).toFixed(1);
    const avgTemp = (records.reduce((acc, r) => acc + r.temperature, 0) / total).toFixed(1);
    const latest = records[0];

    return res.json({
      success: true,
      stats: {
        totalRecords: total,
        avgBattery: Number(avgBatt),
        avgTemperature: Number(avgTemp),
        latestStatus: latest.status,
        latestAltitude: latest.altitude,
        latestSpeed: latest.speed,
        latestBattery: latest.battery,
        latestTemperature: latest.temperature,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error calculating stats" });
  }
});

// 5. SEED SAMPLE DATA (Insert 12 records)
router.post("/seed", async (req, res) => {
  try {
    const sampleData = [];
    const now = Date.now();

    for (let i = 11; i >= 0; i--) {
      const timeOffset = i * 5 * 60 * 1000;
      const batt = Math.max(30, 95 - i * 3);
      const temp = Number((22 + (11 - i) * 0.8).toFixed(1));
      const alt = Number((500 + Math.sin(i / 2) * 15).toFixed(1));
      const spd = Number((27500 + Math.cos(i) * 100).toFixed(0));

      sampleData.push({
        podId: "SomaiyaPod-01",
        battery: batt,
        temperature: temp,
        altitude: alt,
        speed: spd,
        status: batt < 40 ? "Warning" : "Nominal",
        source: "Seed Data",
        timestamp: new Date(now - timeOffset),
      });
    }

    await Telemetry.insertMany(sampleData);
    return res.json({ success: true, message: "Seeded 12 records successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error seeding data" });
  }
});

// 6. DELETE RECORD BY ID (Delete)
router.delete("/:id", async (req, res) => {
  try {
    await Telemetry.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Record deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting record" });
  }
});

export default router;
