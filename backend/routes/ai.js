import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Telemetry from "../models/Telemetry.js";

const router = express.Router();

// Helper to get fallback rule-based diagnostic when Gemini API key isn't provided yet
function generateLocalDiagnostics(records) {
  const latest = records[0] || {
    battery: 88,
    temperature: 22.5,
    altitude: 500,
    speed: 27500,
    status: "Nominal",
  };

  const isBatteryLow = latest.battery < 40;
  const isTempHigh = latest.temperature > 45;
  const risk = isBatteryLow || isTempHigh ? "Moderate Risk (Caution)" : "Low Risk (Optimal)";

  return `### SomaiyaPod AI Diagnostics Report (Automated)

**1. Subsystem Health Assessment:**
- Overall Status: **${latest.status}**
- Battery Level: **${latest.battery}%** (${latest.battery > 70 ? "Solar charging normal" : "Power conservation recommended"})
- Thermal State: **${latest.temperature} °C** (${latest.temperature < 40 ? "Within nominal flight boundaries" : "Elevated thermal dissipation"})
- Orbital Parameters: **${latest.altitude} km** altitude at **${latest.speed} km/h**

**2. Anomaly & Risk Evaluation:**
- Anomaly Probability: **${risk}**
- Communication Downlink Confidence: **98.4%**
- Pass Window Duration: **8 - 10 minutes** over Ground Station (KJSIEIT Mumbai)

**3. Flight Engineer Recommendations:**
- Maintain current M17 telemetry beacon frequency (436.500 MHz).
- Keep passive thermal radiator pointed away from direct solar radiation.

---
*(Note: Add your GEMINI_API_KEY in backend/.env to activate live Google Gemini AI generation)*`;

}

// 1. ANALYZE TELEMETRY DATA WITH GEMINI AI
router.post("/analyze", async (req, res) => {
  try {
    // 1. Get recent telemetry data from MongoDB
    const recentTelemetry = await Telemetry.find().sort({ timestamp: -1 }).limit(5);

    if (recentTelemetry.length === 0) {
      return res.json({
        success: true,
        source: "System Notice",
        analysis: "No telemetry records found in MongoDB yet. Please click 'Fetch from API' or 'Seed Sample Data' first to generate telemetry readings for AI analysis.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. If Gemini API key is provided, query Google Gemini
    if (apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

        const telemetrySummary = recentTelemetry
          .map(
            (t, i) =>
              `Record ${i + 1} (${t.timestamp.toISOString()}): Battery: ${t.battery}%, Temp: ${t.temperature}°C, Altitude: ${t.altitude}km, Speed: ${t.speed}km/h, Status: ${t.status}, Source: ${t.source}`
          )
          .join("\n");

        const prompt = `You are the Chief AI Flight Director for SomaiyaPod (an experimental student satellite & hyperloop pod project).
Analyze these recent telemetry sensor records from our MongoDB database:

${telemetrySummary}

Please deliver a concise, professional Mission Control Diagnostics briefing with:
1. System Health & Performance (Battery, Thermal, Altitude)
2. Anomaly Risk Evaluation & Predicted Pass Window
3. Operational Recommendations & Next Steps.
Keep the formatting clean with Markdown bullet points.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.json({
          success: true,
          source: "Google Gemini AI (gemini-3.8-flash)",
          analysis: responseText,
          dataCount: recentTelemetry.length,
        });
      } catch (geminiError) {
        console.error("Gemini API call failed, using fallback diagnostics:", geminiError.message);
        const fallbackText = generateLocalDiagnostics(recentTelemetry) + `\n\n*(Gemini API Note: ${geminiError.message})*`;
        return res.json({
          success: true,
          source: "Local Fallback AI",
          analysis: fallbackText,
          dataCount: recentTelemetry.length,
        });
      }
    }

    // 3. If no API key is set in .env, return smart local diagnostics
    const fallbackText = generateLocalDiagnostics(recentTelemetry);
    return res.json({
      success: true,
      source: "Local Diagnostics Engine",
      analysis: fallbackText,
      dataCount: recentTelemetry.length,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ success: false, message: "Error running AI analysis.", error: error.message });
  }
});

// 2. CHAT WITH GEMINI ABOUT TELEMETRY / POD
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
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

      const telemetryContext = latest
        ? `Latest Pod Telemetry: Battery=${latest.battery}%, Temp=${latest.temperature}°C, Altitude=${latest.altitude}km, Speed=${latest.speed}km/h, Status=${latest.status}.`
        : "No active telemetry data.";

      const prompt = `Context: You are SomaiyaPod Mission Assistant AI. ${telemetryContext}
User Question: "${question}"
Answer concisely, accurately, and scientifically in 2-3 short paragraphs.`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      return res.json({ success: true, reply, source: "Google Gemini AI" });
    }

    // Fallback answer if no Gemini key
    return res.json({
      success: true,
      reply: `SomaiyaPod AI response to: "${question}". Current telemetry readings: Battery: ${latest ? latest.battery : 88}%, Temperature: ${latest ? latest.temperature : 22.5}°C, Status: ${latest ? latest.status : "Nominal"}. (Add GEMINI_API_KEY to backend/.env for dynamic generative answers!)`,
      source: "Local Diagnostics Engine",
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({ success: false, message: "Error in AI Chat.", error: error.message });
  }
});

export default router;
