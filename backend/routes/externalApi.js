import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

// GET /api/external/fetch-and-save
// Fetches live satellite / pod telemetry from external API and persists it to MongoDB
router.get("/fetch-and-save", async (req, res) => {
  try {
    let telemetryData = null;
    let apiSource = "WhereTheISS.at Public API";

    // 1. Attempt to fetch real-time orbital data from open satellite API
    try {
      const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const json = await response.json();
        // ISS / Pod parameters
        const alt = Number(json.altitude.toFixed(1)); // km
        const velocity = Number(json.velocity.toFixed(0)); // km/h
        const visibility = json.visibility; // daylight or eclipsed
        
        // Dynamic temperature & battery based on daylight/eclipsed
        const isDaylight = visibility === "daylight";
        const temp = isDaylight ? 26.5 : 18.2;
        const batt = isDaylight ? 94 : 82;

        telemetryData = {
          podId: "SomaiyaSat-ISS-25544",
          altitude: alt,
          speed: velocity,
          temperature: temp,
          battery: batt,
          pressure: 101.3,
          signalQuality: 98,
          status: "Nominal",
          source: apiSource,
        };
      }
    } catch (apiErr) {
      console.warn("External live API unreachable, falling back to orbital calculation:", apiErr.message);
    }

    // Fallback if external API has a network hiccup or rate limit
    if (!telemetryData) {
      apiSource = "SomaiyaPod Ground Station Simulation API";
      const nowSec = Date.now() / 1000;
      telemetryData = {
        podId: "SomaiyaPod-01",
        altitude: Number((500 + Math.sin(nowSec / 100) * 15).toFixed(1)),
        speed: Number((27500 + Math.cos(nowSec / 100) * 80).toFixed(0)),
        temperature: Number((23.0 + Math.sin(nowSec / 50) * 3).toFixed(1)),
        battery: Math.floor(85 + Math.sin(nowSec / 200) * 10),
        pressure: 101.3,
        signalQuality: 96,
        status: "Nominal",
        source: apiSource,
      };
    }

    // 2. Save into MongoDB database
    const savedTelemetry = new Telemetry({
      ...telemetryData,
      timestamp: new Date(),
    });

    await savedTelemetry.save();

    return res.status(201).json({
      success: true,
      message: `Telemetry fetched from ${apiSource} and saved to MongoDB!`,
      data: savedTelemetry,
    });
  } catch (error) {
    console.error("Fetch & Save Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch and save telemetry data.",
      error: error.message,
    });
  }
});

export default router;
