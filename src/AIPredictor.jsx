import React, { useState, useEffect, useRef } from "react";

/**
 * AIPredictor Component
 * AI-assisted telemetry diagnostics and orbital pass prediction module.
 * Demonstrates state management (useState), side effects (useEffect), and persistent references (useRef).
 */
function AIPredictor() {
  // Hook 1 (useState): Input orbital altitude slider value (in km, default 500)
  const [altitude, setAltitude] = useState(500);

  // Hook 1 (useState): Input signal noise ratio slider value (in dB, default 15)
  const [signalNoise, setSignalNoise] = useState(15);

  // Hook 1 (useState): Battery health dropdown selection ('Nominal', 'Degraded', 'Critical')
  const [batteryHealth, setBatteryHealth] = useState("Nominal");

  // Hook 1 (useState): Boolean tracking if asynchronous AI analysis is currently running
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Hook 1 (useState): Object storing output results calculated by AI diagnostic algorithm
  const [analysisResult, setAnalysisResult] = useState({
    anomalyScore: "2% (Low Risk)",
    predictedPassWindow: "8 minutes",
    healthAssessment: "Optimal Health",
    downlinkConfidence: "98%"
  });

  // Hook 3 (useRef): Persistent reference tracking total diagnostic runs without causing extra re-renders
  const runCountRef = useRef(0);

  // Handler function simulating asynchronous AI model analysis with simple logic
  const runAIDiagnostics = () => {
    // Set analyzing state to true to display loading message
    setIsAnalyzing(true);

    // Increment diagnostic runs counter ref
    runCountRef.current = runCountRef.current + 1;

    // Simulate async processing delay using setTimeout (1 second)
    setTimeout(() => {
      // Simple Pass Window check: if altitude > 500 km, set to 10 mins, else 8 mins
      const passWindow = altitude > 500 ? "10 minutes" : "8 minutes";

      // Simple Anomaly Risk check based on battery health condition
      let riskScore = "2% (Low Risk)";
      if (batteryHealth === "Degraded") {
        riskScore = "5% (Moderate Risk)";
      } else if (batteryHealth === "Critical") {
        riskScore = "12% (High Risk)";
      }

      // Simple health assessment string
      const healthStatus = batteryHealth === "Nominal" ? "Optimal Health" : "Caution Advised";

      // Update state object with new AI predictions
      setAnalysisResult({
        anomalyScore: riskScore,
        predictedPassWindow: passWindow,
        healthAssessment: healthStatus,
        downlinkConfidence: signalNoise > 15 ? "99%" : "95%"
      });

      // Toggle analyzing loading state back to false
      setIsAnalyzing(false);
    }, 1000);
  };

  // Hook 2 (useEffect): Automatically triggers initial AI diagnostics scan when component mounts
  useEffect(() => {
    runAIDiagnostics();
  }, []);

  return (
    <div className="ai-predictor-container">
      {/* Page Title Header */}
      <div className="page-header">
        <h2>AI Telemetry Diagnostics & Orbit Predictor</h2>
        <p className="subtitle">Machine Learning Subsystem Health & Ground Node Pass Prediction</p>
      </div>

      <div className="mission-grid">
        {/* Card 1: Interactive Parameter Controls */}
        <div className="card mission-card">
          <div className="card-header-badge">AI Input Controls</div>
          <h3>Telemetry Simulation Parameters</h3>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Control 1: Orbital Altitude Slider */}
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

            {/* Control 2: Signal Noise Ratio Slider */}
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

            {/* Control 3: Battery Health Select */}
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

            {/* Execute Diagnostics Button */}
            <button
              type="button"
              className="primary-btn"
              onClick={runAIDiagnostics}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Processing AI Model..." : "Run AI Diagnostics"}
            </button>
          </form>
        </div>

        {/* Card 2: AI Diagnostic Output Metrics */}
        <div className="card mission-card">
          <div className="card-header-badge">AI Output Analysis</div>
          <h3>Predicted Satellite Status</h3>

          {isAnalyzing ? (
            <div className="loading-container">
              <p>Analyzing telemetry logs...</p>
            </div>
          ) : (
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
                <span className="spec-label">Total Diagnostics Executed:</span>
                <span className="spec-val">{runCountRef.current} Times</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIPredictor;
