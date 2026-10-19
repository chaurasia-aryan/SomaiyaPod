import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";
import Forms from "./Forms";
import LiveData from "./API_Intergration";
import MissionInfo from "./MissionInfo";
import AIPredictor from "./AIPredictor";
import DataTab from "./DataTab";
import TelemetryCharts from "./TelemetryCharts";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Telemetry metrics from MongoDB
  const [metrics, setMetrics] = useState({
    battery: 88,
    temperature: 22.5,
    altitude: 500,
    speed: 27500,
    status: "Nominal",
    podId: "SomaiyaPod-01",
  });

  // Check if user was previously logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("somaiya_user");
    const savedToken = localStorage.getItem("somaiya_token");
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error reading saved user:", e);
      }
    }
  }, []);

  // Fetch latest telemetry reading from backend
  const refreshLatestTelemetry = async () => {
    try {
      const res = await fetch("/api/telemetry?limit=1");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const latest = data.data[0];
        setMetrics({
          battery: latest.battery,
          temperature: latest.temperature,
          altitude: latest.altitude,
          speed: latest.speed,
          status: latest.status,
          podId: latest.podId,
        });
      }
    } catch (err) {
      console.error("Error fetching latest telemetry:", err);
    }
  };

  useEffect(() => {
    refreshLatestTelemetry();
    const interval = setInterval(refreshLatestTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fast action: Sync external live satellite API
  const handleSyncISS = async () => {
    setActionLoading(true);
    setStatusMessage("Querying live orbital tracking API...");
    try {
      const res = await fetch("/api/external/fetch-and-save");
      const result = await res.json();
      if (result.success) {
        setStatusMessage(`Live satellite data synchronized: ${result.data.podId}`);
        await refreshLatestTelemetry();
      } else {
        setStatusMessage("Failed to ingest external satellite data.");
      }
    } catch (err) {
      setStatusMessage("Error communicating with satellite ingestion service.");
    } finally {
      setActionLoading(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  // Fast action: Seed sample flight telemetry
  const handleSeedData = async () => {
    setActionLoading(true);
    setStatusMessage("Injecting flight telemetry sequence into MongoDB...");
    try {
      const res = await fetch("/api/telemetry/seed", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        setStatusMessage(`Telemetry seeded (${result.count} records inserted).`);
        await refreshLatestTelemetry();
      } else {
        setStatusMessage("Failed to seed telemetry records.");
      }
    } catch (err) {
      setStatusMessage("Error triggering telemetry seed endpoint.");
    } finally {
      setActionLoading(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("somaiya_token");
    localStorage.removeItem("somaiya_user");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActivePage("auth");
  };

  const renderContent = () => {
    if (!isLoggedIn && activePage === "auth") {
      return <Forms onLoginSuccess={handleLoginSuccess} />;
    }

    switch (activePage) {
      case "data":
        return <DataTab />;

      case "charts":
        return <TelemetryCharts />;

      case "ai":
        return <AIPredictor />;

      case "live-api":
        return <LiveData />;

      case "about":
        return <MissionInfo />;

      case "auth":
        return <Forms onLoginSuccess={handleLoginSuccess} />;

      case "dashboard":
      default:
        return (
          <div className="dashboard-container">
            {/* Mission Station Status Ribbon */}
            <div className="telemetry-ribbon">
              <div className="ribbon-metrics">
                <div className="ribbon-item">
                  <span className="ribbon-label">Target:</span>
                  <span className="ribbon-val">{metrics.podId || "SomaiyaPod-01"}</span>
                </div>
                <div className="ribbon-item">
                  <span className="ribbon-label">Link Status:</span>
                  <span className="ribbon-val" style={{ color: metrics.status === "Nominal" ? "var(--status-nominal)" : "var(--status-warning)" }}>
                    {metrics.status || "Nominal"}
                  </span>
                </div>
                <div className="ribbon-item">
                  <span className="ribbon-label">Battery:</span>
                  <span className="ribbon-val">{metrics.battery}%</span>
                </div>
                <div className="ribbon-item">
                  <span className="ribbon-label">Thermal:</span>
                  <span className="ribbon-val">{metrics.temperature} C</span>
                </div>
                <div className="ribbon-item">
                  <span className="ribbon-label">Altitude:</span>
                  <span className="ribbon-val">{metrics.altitude} km</span>
                </div>
              </div>

              {/* Fast Action Buttons for Scientists */}
              <div className="ribbon-controls">
                <button
                  className="action-btn"
                  onClick={refreshLatestTelemetry}
                  disabled={actionLoading}
                  title="Query MongoDB for newest telemetry packet"
                >
                  Refresh
                </button>
                <button
                  className="action-btn"
                  onClick={handleSyncISS}
                  disabled={actionLoading}
                  title="Query live orbital API and save to database"
                >
                  Sync ISS Tracker
                </button>
                <button
                  className="action-btn btn-dark"
                  onClick={handleSeedData}
                  disabled={actionLoading}
                  title="Seed 12 simulated flight packets"
                >
                  Seed Test Data
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="notification-banner">
                {statusMessage}
              </div>
            )}

            {!isLoggedIn && (
              <div className="notification-banner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Notice: Operating in Guest Mode. Sign in with operator credentials to write or purge data.</span>
                <button className="action-btn" style={{ fontSize: "0.75rem", padding: "3px 8px" }} onClick={() => setActivePage("auth")}>
                  Sign In
                </button>
              </div>
            )}

            {/* Scientific Instrument Matrix (6-Card Telemetry Grid) */}
            <div className="page-header" style={{ marginTop: "10px" }}>
              <h2>Active Telemetry Matrix</h2>
              <p className="subtitle">High-frequency sensor downlinks recorded in MongoDB</p>
            </div>

            <div className="telemetry-matrix">
              <div className="instrument-card">
                <div className="instrument-header">
                  <span className="instrument-label">Target ID</span>
                  <span className="instrument-badge">LEO</span>
                </div>
                <div className="instrument-value" style={{ fontSize: "1.45rem" }}>
                  {metrics.podId || "SomaiyaPod-01"}
                </div>
                <div className="instrument-subtext">Active Ground Tracking</div>
              </div>

              <div className="instrument-card">
                <div className="instrument-header">
                  <span className="instrument-label">Health Status</span>
                  <span className="instrument-badge" style={{ color: metrics.status === "Nominal" ? "var(--text-main)" : "var(--status-warning)" }}>
                    {metrics.status}
                  </span>
                </div>
                <div className="instrument-value">
                  {metrics.status || "Nominal"}
                </div>
                <div className="instrument-subtext">Automated Threshold Evaluation</div>
              </div>

              <div className="instrument-card">
                <div className="instrument-header">
                  <span className="instrument-label">Battery Power</span>
                  <span className="instrument-badge">Main Bus</span>
                </div>
                <div className="instrument-value">
                  {metrics.battery}%
                </div>
                <div className="mini-gauge">
                  <div className="mini-gauge-fill" style={{ width: `${Math.min(100, Math.max(0, metrics.battery))}%` }}></div>
                </div>
                <div className="instrument-subtext" style={{ marginTop: "6px" }}>
                  {metrics.battery > 70 ? "Solar Cells Optimal" : "Low Power Reserve"}
                </div>
              </div>

              <div className="instrument-card">
                <div className="instrument-header">
                  <span className="instrument-label">Thermal System</span>
                  <span className="instrument-badge">Sensor T-1</span>
                </div>
                <div className="instrument-value">
                  {metrics.temperature} C
                </div>
                <div className="instrument-subtext">Cooling Loop Nominal</div>
              </div>

              <div className="instrument-card">
                <div className="instrument-header">
                  <span className="instrument-label">Orbital Altitude</span>
                  <span className="instrument-badge">GPS Alt</span>
                </div>
                <div className="instrument-value">
                  {metrics.altitude} km
                </div>
                <div className="instrument-subtext">Low Earth Orbit Trajectory</div>
              </div>

              <div className="instrument-card">
                <div className="instrument-header">
                  <span className="instrument-label">Velocity</span>
                  <span className="instrument-badge">Relative</span>
                </div>
                <div className="instrument-value">
                  {Number(metrics.speed || 27500).toLocaleString()} km/h
                </div>
                <div className="instrument-subtext">Orbital Ground Speed</div>
              </div>
            </div>

            {/* Quick Scientific Modules Navigation Grid */}
            <div className="page-header" style={{ marginTop: "24px" }}>
              <h2>Mission Control Subsystems</h2>
              <p className="subtitle">Direct navigation to ground station operations, analysis, and data layers</p>
            </div>

            <div className="action-grid">
              <div className="action-tool-card" onClick={() => setActivePage("data")}>
                <div>
                  <div className="action-tool-title">Telemetry Data Engine</div>
                  <div className="action-tool-desc">
                    Direct access to MongoDB telemetry records. Perform CRUD queries, filter by threshold status, or purge records.
                  </div>
                </div>
                <div className="action-tool-link">Open Telemetry Records &rarr;</div>
              </div>

              <div className="action-tool-card" onClick={() => setActivePage("charts")}>
                <div>
                  <div className="action-tool-title">Graphs &amp; Metric Curves</div>
                  <div className="action-tool-desc">
                    Time-series visualization for voltage discharge, temperature equilibrium, and altitude trajectory.
                  </div>
                </div>
                <div className="action-tool-link">Open Visual Analytics &rarr;</div>
              </div>

              <div className="action-tool-card" onClick={() => setActivePage("ai")}>
                <div>
                  <div className="action-tool-title">Gemini AI Diagnostics</div>
                  <div className="action-tool-desc">
                    Generative AI health evaluation with telemetry anomaly detection, operational summaries, and engineering Q&amp;A.
                  </div>
                </div>
                <div className="action-tool-link">Launch AI Assistant &rarr;</div>
              </div>

              <div className="action-tool-card" onClick={() => setActivePage("live-api")}>
                <div>
                  <div className="action-tool-title">Orbital Satellite Tracker</div>
                  <div className="action-tool-desc">
                    Real-time external satellite positioning API integration pulling live orbital passes with automated fallbacks.
                  </div>
                </div>
                <div className="action-tool-link">Track Orbital Position &rarr;</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        title="SomaiyaPod Ground Station"
        activePage={activePage}
        setActivePage={setActivePage}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;