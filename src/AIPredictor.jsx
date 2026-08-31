import React, { useState, useMemo } from "react";

// AI Telemetry Diagnostics & Orbit Predictor Component
// Uses React's useMemo hook to optimize performance by memoizing complex telemetry prediction calculations,
// with interactive options to toggle useMemo optimization and create telemetry checkpoints.
function AIPredictor() {
  // State hooks for telemetry input simulation parameters
  const [altitude, setAltitude] = useState(500); // Orbital altitude in kilometers
  const [signalNoise, setSignalNoise] = useState(15); // Signal-to-Noise ratio in dB
  const [batteryHealth, setBatteryHealth] = useState("Nominal"); // Battery health status condition

  // Option state hooks for useMemo toggle & telemetry checkpointing
  const [useMemoEnabled, setUseMemoEnabled] = useState(true); // Toggle to use/bypass useMemo
  const [checkpoint, setCheckpoint] = useState(null); // Saved telemetry checkpoint state

  // Internal diagnostic calculation logic
  const computeDiagnostics = (alt, snr, battery) => {
    // 1. Calculate ground station orbital pass window based on altitude
    const passWindow = alt > 500 ? "10 minutes" : "8 minutes";

    // 2. Assess anomaly risk score based on battery health condition
    let riskScore = "2% (Low Risk)";
    if (battery === "Degraded") {
      riskScore = "5% (Moderate Risk)";
    } else if (battery === "Critical") {
      riskScore = "12% (High Risk)";
    }

    // 3. Determine subsystem health assessment status
    const healthStatus = battery === "Nominal" ? "Optimal Health" : "Caution Advised";

    // 4. Evaluate downlink link confidence based on Signal-to-Noise Ratio (SNR)
    const downlinkConfidence = snr > 15 ? "99%" : "95%";

    return {
      anomalyScore: riskScore,
      predictedPassWindow: passWindow,
      healthAssessment: healthStatus,
      downlinkConfidence: downlinkConfidence
    };
  };

  // useMemo Hook Integration:
  // Memoizes the AI diagnostic analysis calculations when useMemoEnabled is true.
  const memoizedAnalysis = useMemo(() => {
    return computeDiagnostics(altitude, signalNoise, batteryHealth);
  }, [altitude, signalNoise, batteryHealth]);

  // If useMemo is enabled, use memoized result; otherwise perform direct unmemoized computation
  const analysisResult = useMemoEnabled
    ? memoizedAnalysis
    : computeDiagnostics(altitude, signalNoise, batteryHealth);

  // Handler to capture and save a telemetry checkpoint snapshot
  const handleCreateCheckpoint = () => {
    setCheckpoint({
      timestamp: new Date().toLocaleTimeString(),
      altitude,
      signalNoise,
      batteryHealth,
      anomalyScore: analysisResult.anomalyScore,
      predictedPassWindow: analysisResult.predictedPassWindow,
      mode: useMemoEnabled ? "Memoized (useMemo)" : "Direct (Unmemoized)"
    });
  };

  return (
    <div className="ai-predictor-container">
      {/* Page Title Header */}
      <div className="page-header">
        <h2>AI Telemetry Diagnostics & Orbit Predictor</h2>
        <p className="subtitle">Machine Learning Subsystem Health & Ground Node Pass Prediction</p>
      </div>

      <div className="mission-grid">
        {/* Left Card: Input Parameter Controls & Checkpoint Options */}
        <div className="card mission-card">
          <div className="card-header-badge">AI Input Controls</div>
          <h3>Telemetry Simulation Parameters</h3>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Slider for Orbital Altitude */}
            <div className="form-group">
              <label>Orbital Altitude: {altitude} km</label>
              <input
                type="range"
                min="300"
                max="800"
                step="50"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
              />
            </div>

            {/* Slider for Signal-to-Noise Ratio */}
            <div className="form-group">
              <label>Signal-to-Noise Ratio: {signalNoise} dB</label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={signalNoise}
                onChange={(e) => setSignalNoise(Number(e.target.value))}
              />
            </div>

            {/* Dropdown for Battery Health Condition */}
            <div className="form-group">
              <label>Battery Health Condition</label>
              <select
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(e.target.value)}
              >
                <option value="Nominal">Nominal (100% Cell Capacity)</option>
                <option value="Degraded">Degraded (80% Cell Capacity)</option>
                <option value="Critical">Critical (Low Charge Threshold)</option>
              </select>
            </div>

            {/* Option to Enable/Disable useMemo Optimization */}
            <div className="form-group checkbox-group" style={{ marginTop: "14px" }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useMemoEnabled}
                  onChange={(e) => setUseMemoEnabled(e.target.checked)}
                />
                Use <code>useMemo</code> Optimization Hook
              </label>
            </div>

            {/* Button to Save Telemetry Checkpoint */}
            <div style={{ marginTop: "16px" }}>
              <button
                type="button"
                className="primary-btn"
                onClick={handleCreateCheckpoint}
                style={{ width: "100%" }}
              >
                Create Telemetry Checkpoint
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Memoized AI Output Analysis & Checkpoint View */}
        <div className="card mission-card">
          <div className="card-header-badge">AI Output Analysis</div>
          <h3>Predicted Satellite Status</h3>

          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-label">Anomaly Risk Score:</span>
              <span className="spec-val green-text">{analysisResult.anomalyScore}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Predicted Pass Window:</span>
              <span className="spec-val">{analysisResult.predictedPassWindow}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Subsystem Assessment:</span>
              <span className="spec-val">{analysisResult.healthAssessment}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Downlink Link Quality:</span>
              <span className="spec-val">{analysisResult.downlinkConfidence}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Optimization Status:</span>
              <span className={`spec-val ${useMemoEnabled ? "green-text" : "warning-text"}`}>
                {useMemoEnabled ? "Memoized (useMemo Active)" : "Direct (Unmemoized)"}
              </span>
            </div>
          </div>

          {/* Display Saved Checkpoint Information */}
          {checkpoint && (
            <div style={{ marginTop: "20px", padding: "12px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
              <h4 style={{ fontSize: "0.9rem", color: "#2563eb", marginBottom: "6px" }}>
                Saved Checkpoint ({checkpoint.timestamp})
              </h4>
              <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div><strong>Altitude:</strong> {checkpoint.altitude} km</div>
                <div><strong>Battery:</strong> {checkpoint.batteryHealth}</div>
                <div><strong>Risk Score:</strong> {checkpoint.anomalyScore}</div>
                <div><strong>Mode:</strong> {checkpoint.mode}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIPredictor;
