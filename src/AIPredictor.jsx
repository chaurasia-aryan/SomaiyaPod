import React, { useState, useMemo } from "react";

function AIPredictor() {
  const [altitude, setAltitude] = useState(500);
  const [signalNoise, setSignalNoise] = useState(15);
  const [batteryHealth, setBatteryHealth] = useState("Nominal");

  const analysisResult = useMemo(() => {
    const passWindow = altitude > 500 ? "10 minutes" : "8 minutes";

    let riskScore = "2% (Low Risk)";
    if (batteryHealth === "Degraded") {
      riskScore = "5% (Moderate Risk)";
    } else if (batteryHealth === "Critical") {
      riskScore = "12% (High Risk)";
    }

    const healthStatus = batteryHealth === "Nominal" ? "Optimal Health" : "Caution Advised";

    return {
      anomalyScore: riskScore,
      predictedPassWindow: passWindow,
      healthAssessment: healthStatus,
      downlinkConfidence: signalNoise > 15 ? "99%" : "95%"
    };
  }, [altitude, signalNoise, batteryHealth]);

  return (
    <div className="ai-predictor-container">
      <div className="page-header">
        <h2>AI Telemetry Diagnostics & Orbit Predictor</h2>
        <p className="subtitle">Machine Learning Subsystem Health & Ground Node Pass Prediction</p>
      </div>

      <div className="mission-grid">
        <div className="card mission-card">
          <div className="card-header-badge">AI Input Controls</div>
          <h3>Telemetry Simulation Parameters</h3>

          <form onSubmit={(e) => e.preventDefault()}>
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
          </form>
        </div>

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
              <span className="spec-label">Optimization Mode:</span>
              <span className="spec-val">Memoized (useMemo)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPredictor;
