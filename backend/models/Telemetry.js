import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
  {
    podId: { type: String, default: "SomaiyaPod-01" },
    battery: { type: Number, min: 0, max: 100, default: null },
    temperature: { type: Number, default: null },
    altitude: { type: Number, required: true },
    speed: { type: Number, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    visibility: { type: String, default: null },
    status: {
      type: String,
      enum: ["Nominal", "Warning", "Critical", "Unknown"],
      default: "Unknown",
    },
    source: { type: String, default: "Manual Entry" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Telemetry", telemetrySchema);
