import express from "express";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";

router.get("/fetch-and-save", async (req, res) => {
  try {
    const response = await fetch(ISS_URL, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: `Satellite API responded with HTTP ${response.status}.`,
      });
    }

    const iss = await response.json();

    const record = await Telemetry.create({
      podId: "ISS-25544",
      altitude: Number(iss.altitude.toFixed(1)),
      speed: Number(iss.velocity.toFixed(0)),
      latitude: Number(iss.latitude.toFixed(4)),
      longitude: Number(iss.longitude.toFixed(4)),
      visibility: iss.visibility,
      source: "WhereTheISS.at",
      timestamp: new Date(iss.timestamp * 1000),
    });

    return res.status(201).json({
      success: true,
      message: "Live ISS telemetry fetched from WhereTheISS.at and saved to MongoDB.",
      data: record,
    });
  } catch (error) {
    const timedOut = error.name === "TimeoutError" || error.name === "AbortError";
    return res.status(502).json({
      success: false,
      message: timedOut
        ? "Satellite API timed out after 6 seconds. No data was saved."
        : `Could not reach satellite API: ${error.message}`,
    });
  }
});

export default router;
