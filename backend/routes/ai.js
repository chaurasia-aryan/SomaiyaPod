import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

const fmt = (v, unit = "") => (v === null || v === undefined ? "N/A" : `${v}${unit}`);

function generateLocalDiagnostics(records) {
  const latest = records[0];
  const notes = [];
  if (typeof latest.battery === "number") {
    notes.push(latest.battery < 40 ? "Battery below 40%: power conservation recommended." : "Battery level acceptable.");
  }
  if (typeof latest.temperature === "number") {
    notes.push(latest.temperature > 45 ? "Temperature above 45 °C: elevated thermal load." : "Temperature within normal range.");
  }
  if (notes.length === 0) notes.push("The latest record has no battery or temperature reading, so no health judgement is possible.");

  return `### SomaiyaPod Diagnostics Report (rule-based)

**Latest record** (${latest.source}, ${latest.timestamp.toISOString()}):
- Pod: **${latest.podId}**
- Status: **${latest.status}**
- Battery: **${fmt(latest.battery, "%")}**
- Temperature: **${fmt(latest.temperature, " °C")}**
- Altitude: **${fmt(latest.altitude, " km")}**
- Speed: **${fmt(latest.speed, " km/h")}**

**Observations:**
${notes.map((n) => `- ${n}`).join("\n")}`;
}

router.post("/analyze", async (req, res) => {
  try {
    const recentTelemetry = await Telemetry.find().sort({ timestamp: -1 }).limit(5);

    if (recentTelemetry.length === 0) {
      return res.json({
        success: true,
        source: "System Notice",
        analysis: "No telemetry records found in MongoDB yet. Click 'Fetch & Save Live API' or add a record first.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        const telemetrySummary = recentTelemetry
          .map(
            (t, i) =>
              `Record ${i + 1} (${t.timestamp.toISOString()}): Battery: ${fmt(t.battery, "%")}, Temp: ${fmt(t.temperature, "°C")}, Altitude: ${fmt(t.altitude, "km")}, Speed: ${fmt(t.speed, "km/h")}, Status: ${t.status}, Source: ${t.source}`
          )
          .join("\n");

        const prompt = `You are the Chief AI Flight Director for SomaiyaPod (a student satellite project).
Analyze these recent telemetry records from our MongoDB database. "N/A" means that sensor was not available; do not guess values for it:

${telemetrySummary}

Please deliver a concise, professional Mission Control Diagnostics briefing with:
1. System Health & Performance (Battery, Thermal, Altitude)
2. Anomaly Risk Evaluation (based only on the data given)
3. Operational Recommendations & Next Steps.
Keep the formatting clean with Markdown bullet points.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.json({
          success: true,
          source: `Google Gemini AI (${GEMINI_MODEL})`,
          analysis: responseText,
          dataCount: recentTelemetry.length,
        });
      } catch (geminiError) {
        console.error("Gemini API call failed, using fallback diagnostics:", geminiError.message);
        const fallbackText = generateLocalDiagnostics(recentTelemetry) + `\n\n*(Gemini unavailable: ${geminiError.message})*`;
        return res.json({
          success: true,
          source: "Rule-based Diagnostics",
          analysis: fallbackText,
          dataCount: recentTelemetry.length,
        });
      }
    }

    const fallbackText = generateLocalDiagnostics(recentTelemetry);
    return res.json({
      success: true,
      source: "Rule-based Diagnostics",
      analysis: fallbackText,
      dataCount: recentTelemetry.length,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ success: false, message: "Error running AI analysis.", error: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: "Please provide a question." });
    }

    const latest = await Telemetry.findOne().sort({ timestamp: -1 });
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here") {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const telemetryContext = latest
        ? `Latest Pod Telemetry: Battery=${fmt(latest.battery, "%")}, Temp=${fmt(latest.temperature, "°C")}, Altitude=${fmt(latest.altitude, "km")}, Speed=${fmt(latest.speed, "km/h")}, Status=${latest.status}.`
        : "No active telemetry data.";

      const prompt = `Context: You are SomaiyaPod Mission Assistant AI. ${telemetryContext}
User Question: "${question}"
Answer concisely, accurately, and scientifically in 2-3 short paragraphs.`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      return res.json({ success: true, reply, source: "Google Gemini AI" });
    }

    return res.status(503).json({
      success: false,
      message: "Gemini is not configured. Add GEMINI_API_KEY to backend/.env to enable chat.",
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({ success: false, message: "Error in AI Chat.", error: error.message });
  }
});

export default router;
