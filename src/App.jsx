import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";
import Forms from "./Forms";
import LiveData from "./API_Intergration";
import MissionInfo from "./MissionInfo";
import AIPredictor from "./AIPredictor";
import DataTab from "./DataTab";
import TelemetryCharts from "./TelemetryCharts";

function TelemetryCard({ title, value, subtext, statusColor }) {
  return (
    <div className="card telemetry-card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {subtext && (
        <div className={`card-subtext ${statusColor ? statusColor : ""}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

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
    // If not logged in and on auth page or trying to access dashboard directly without login
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
            <div className="dashboard-header flex-between">
              <div>
                <h2>SomaiyaPod Mission Control</h2>
                <p className="subtitle">
                  Autonomous Telemetry &amp; Gemini AI Ground Station &middot; MongoDB Synced
                </p>
              </div>
              <div className="status-badge green-badge">
                ● Telemetry Stream Online
              </div>
            </div>

            {!isLoggedIn && (
              <div className="notification-banner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>🔒 You are browsing in Guest Mode. Login to save records and configure AI.</span>
                <button className="primary-btn" style={{ padding: "4px 12px", fontSize: "0.85rem" }} onClick={() => setActivePage("auth")}>
                  Login / Register
                </button>
              </div>
            )}

            <h3 className="section-title">Live Satellite / Pod Telemetry</h3>

            <div className="card-grid">
              <TelemetryCard
                title="Active Pod / Target"
                value={metrics.podId || "SomaiyaPod-01"}
                subtext="NORAD Tracked"
              />

              <TelemetryCard
                title="System Status"
                value={metrics.status || "Nominal"}
                subtext="Telemetry link active"
                statusColor={metrics.status === "Nominal" ? "green-text" : "warning-text"}
              />

              <TelemetryCard
                title="Battery Power"
                value={`${metrics.battery}%`}
                subtext={metrics.battery > 70 ? "Solar Cells Nominal" : "Low Power Mode"}
                statusColor={metrics.battery > 70 ? "green-text" : "warning-text"}
              />

              <TelemetryCard
                title="Onboard Temperature"
                value={`${metrics.temperature} °C`}
                subtext="Thermal Loop Nominal"
                statusColor="green-text"
              />

              <TelemetryCard
                title="Orbital Altitude"
                value={`${metrics.altitude} km`}
                subtext="LEO Pass Window"
              />

              <TelemetryCard
                title="Pod Velocity"
                value={`${metrics.speed || 27500} km/h`}
                subtext="Orbital Velocity"
              />
            </div>

            {/* Quick Navigation Action Cards */}
            <h3 className="section-title">System Modules &amp; AI Tools</h3>
            <div className="quick-actions-bar" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "12px" }}>
              <button
                className="card action-nav-card"
                onClick={() => setActivePage("data")}
                style={{ textAlign: "left", cursor: "pointer", padding: "16px" }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Telemetry Data</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  View MongoDB records, fetch live API and manage entries.
                </div>
              </button>

              <button
                className="card action-nav-card"
                onClick={() => setActivePage("charts")}
                style={{ textAlign: "left", cursor: "pointer", padding: "16px" }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Graphs &amp; Charts</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Visual trends for battery, temperature, altitude and speed.
                </div>
              </button>

              <button
                className="card action-nav-card"
                onClick={() => setActivePage("ai")}
                style={{ textAlign: "left", cursor: "pointer", padding: "16px" }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Gemini AI Diagnostics</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Deep anomaly detection, health reports and interactive AI chat.
                </div>
              </button>

              <button
                className="card action-nav-card"
                onClick={() => setActivePage("live-api")}
                style={{ textAlign: "left", cursor: "pointer", padding: "16px" }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Live API Tracker</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Real-time orbital tracking via external satellite endpoints.
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar
        title="SomaiyaPod Mission Control"
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