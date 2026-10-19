import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

// 1. GET ALL TELEMETRY RECORDS
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const records = await Telemetry.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    return res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    console.error("Fetch Telemetry Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching telemetry records." });
  }
});

// 2. ADD A NEW TELEMETRY RECORD
router.post("/", async (req, res) => {
  try {
    const {
      podId,
      battery,
      temperature,
      altitude,
      speed,
      pressure,
      signalQuality,
      status,
      source,
    } = req.body;

    // Determine status automatically if not provided
    let calculatedStatus = status || "Nominal";
    if (battery < 25 || temperature > 60) {
      calculatedStatus = "Critical";
    } else if (battery < 50 || temperature > 40) {
      calculatedStatus = "Warning";
    }

    const newRecord = new Telemetry({
      podId: podId || "SomaiyaPod-01",
      battery: Number(battery) ?? 85,
      temperature: Number(temperature) ?? 24.5,
      altitude: Number(altitude) ?? 510,
      speed: Number(speed) ?? 27500,
      pressure: Number(pressure) ?? 101.3,
      signalQuality: Number(signalQuality) ?? 95,
      status: calculatedStatus,
      source: source || "Manual Entry",
      timestamp: new Date(),
    });

    await newRecord.save();

    return res.status(201).json({
      success: true,
      message: "Telemetry record added successfully!",
      data: newRecord,
    });
  } catch (error) {
    console.error("Save Telemetry Error:", error);
    return res.status(500).json({ success: false, message: "Error creating telemetry record." });
  }
});

// 3. GET TELEMETRY STATS & SUMMARY
router.get("/stats", async (req, res) => {
  try {
    const records = await Telemetry.find().sort({ timestamp: -1 }).limit(50);

    if (records.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalRecords: 0,
          avgBattery: 0,
          avgTemperature: 0,
          latestStatus: "Offline",
          latestAltitude: 0,
          latestSpeed: 0,
        },
      });
    }

    const totalRecords = records.length;
    const avgBattery = (records.reduce((acc, r) => acc + r.battery, 0) / totalRecords).toFixed(1);
    const avgTemperature = (records.reduce((acc, r) => acc + r.temperature, 0) / totalRecords).toFixed(1);
    const latest = records[0];

    return res.json({
      success: true,
      stats: {
        totalRecords,
        avgBattery: Number(avgBattery),
        avgTemperature: Number(avgTemperature),
        latestStatus: latest.status,
        latestAltitude: latest.altitude,
        latestSpeed: latest.speed,
        latestBattery: latest.battery,
        latestTemperature: latest.temperature,
      },
    });
  } catch (error) {
    console.error("Telemetry Stats Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching telemetry stats." });
  }
});

// 4. SEED SAMPLE TELEMETRY DATA (Helpful for quick start & graphs)
router.post("/seed", async (req, res) => {
  try {
    // Generate 12 historical data points spaced out in time
    const sampleData = [];
    const now = Date.now();

    for (let i = 11; i >= 0; i--) {
      const timeOffset = i * 5 * 60 * 1000; // 5 mins apart
      const batteryLevel = Math.max(30, 95 - i * 3 + Math.floor(Math.random() * 4));
      const tempLevel = Number((22 + (11 - i) * 0.8 + (Math.random() * 2 - 1)).toFixed(1));
      const altLevel = Number((500 + Math.sin(i / 2) * 20).toFixed(1));
      const speedVal = Number((27500 + Math.cos(i) * 150).toFixed(0));

      let st = "Nominal";
      if (batteryLevel < 40) st = "Warning";

      sampleData.push({
        podId: "SomaiyaPod-01",
        battery: batteryLevel,
        temperature: tempLevel,
        altitude: altLevel,
        speed: speedVal,
        pressure: 101.3,
        signalQuality: 92 + Math.floor(Math.random() * 8),
        status: st,
        source: "Historical Seed",
        timestamp: new Date(now - timeOffset),
      });
    }

    await Telemetry.insertMany(sampleData);

    return res.json({
      success: true,
      message: "Seeded 12 sample telemetry records successfully!",
      count: sampleData.length,
    });
  } catch (error) {
    console.error("Seed Telemetry Error:", error);
    return res.status(500).json({ success: false, message: "Error seeding telemetry data." });
  }
});

// 5. DELETE A TELEMETRY RECORD
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Telemetry.findByIdAndDelete(id);
    return res.json({ success: true, message: "Record deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Error deleting record." });
  }
});

export default router;
