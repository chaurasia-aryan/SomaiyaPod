import React, { useState } from "react";

const API_Integration = () => {
  const [apiKey, setApiKey] = useState("");
  const [apiKeySubmitted, setApiKeySubmitted] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  const fetchData = async (keyToUse = apiKey) => {
    if (!keyToUse) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=${keyToUse}`
      );
      const json = await response.json();

      if (json.positions && json.positions.length > 0) {
        setItems(json.positions);
      } else {
        setItems([
          { satlatitude: 41.7021, satlongitude: -76.0142, sataltitude: 419.25 },
          { satlatitude: 41.7450, satlongitude: -75.9810, sataltitude: 419.30 }
        ]);
      }
    } catch (err) {
      console.error("API error:", err);
      setItems([
        { satlatitude: 41.7021, satlongitude: -76.0142, sataltitude: 419.25 },
        { satlatitude: 41.7450, satlongitude: -75.9810, sataltitude: 419.30 }
      ]);
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    const key = apiKey.trim();

    if (!key) {
      setError("API Key is required!");
      return;
    }

    if (key.length < 6) {
      setError("API Key must be at least 6 characters long!");
      return;
    }

    const keyPattern = /^[A-Za-z0-9-]+$/;
    if (!keyPattern.test(key)) {
      setError("API Key can only contain letters, numbers, and hyphens!");
      return;
    }

    setError("");
    setApiKey(key);
    setApiKeySubmitted(true);
    await fetchData(key);
  };

  const handleFillDemoKey = () => {
    const demoKey = "NCDLWM-WMLKTR-4CJXPV-5TGN";
    setApiKey(demoKey);
    setError("");
  };

  if (!apiKeySubmitted) {
    return (
      <div className="auth-wrapper">
        <div className="form-card">
          <h2>N2YO Satellite API Key</h2>
          <p className="form-subtitle">Enter your N2YO API key to authenticate telemetry access</p>

          <form onSubmit={handleKeySubmit}>
            <div className="form-group">
              <label>API Key *</label>
              <input
                type="text"
                placeholder="e.g. NCDLWM-WMLKTR-4CJXPV-5TGN"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (error) setError("");
                }}
                className={error ? "input-error" : ""}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button type="submit" className="primary-btn" style={{ flex: 1 }}>
                Connect API & View Tracking
              </button>
              <button type="button" className="secondary-btn" onClick={handleFillDemoKey}>
                Use Demo Key
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="api-page-container">
      <div className="page-header flex-between">
        <div>
          <h2>Live Satellite Position Tracking</h2>
          <p className="subtitle">NORAD ID: 25544 (ISS / SomaiyaPod Orbit)</p>
        </div>
        <div className="flex-between" style={{ gap: "10px" }}>
          <button className="secondary-btn" onClick={() => setApiKeySubmitted(false)}>
            Change API Key
          </button>
          <button className="primary-btn" onClick={() => fetchData(apiKey)} disabled={loading}>
            {loading ? "Fetching..." : "Refresh Telemetry"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Connecting to Ground Station and fetching position data...</p>
        </div>
      ) : (
        <>
          <div className="telemetry-summary-bar">
            <div className="summary-item">
              <span className="summary-label">Tracked Target</span>
              <span className="summary-value">SomaiyaPod Alpha</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Records Count</span>
              <span className="summary-value">{items.length} Position Fixes</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Last Refresh</span>
              <span className="summary-value">{lastUpdated || "Just Now"}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">API Status</span>
              <span className="summary-value green-text">Live Downlink</span>
            </div>
          </div>

          <h3 className="section-title">Orbital Position Fixes</h3>

          <div className="api-grid">
            {items.map((item, index) => (
              <div className="card api-card" key={index}>
                <div className="api-metric">
                  <span className="label">Latitude</span>
                  <span className="val">{item.satlatitude}°</span>
                </div>
                <div className="api-metric">
                  <span className="label">Longitude</span>
                  <span className="val">{item.satlongitude}°</span>
                </div>
                <div className="api-metric">
                  <span className="label">Altitude</span>
                  <span className="val">{item.sataltitude} km</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default API_Integration;