import mongoose from "mongoose";

// Simple Telemetry Schema for SomaiyaPod sensor and flight data
const telemetrySchema = new mongoose.Schema(
  {
    podId: {
      type: String,
      default: "SomaiyaPod-01",
    },
    battery: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    temperature: {
      type: Number,
      required: true,
    },
    altitude: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      default: 0,
    },
    pressure: {
      type: Number,
      default: 101.3, // kPa
    },
    signalQuality: {
      type: Number,
      default: 95, // %
    },
    status: {
      type: String,
      enum: ["Nominal", "Warning", "Critical"],
      default: "Nominal",
    },
    source: {
      type: String,
      default: "Telemetry Stream",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

export default Telemetry;
