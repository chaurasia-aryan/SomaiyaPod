import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";
import Forms from "./Forms";
import LiveData from "./API_Intergration";
import MissionInfo from "./MissionInfo";
import AIPredictor from "./AIPredictor";

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

function App({ satelliteid, name, orbit, frequency }) {
  const [battery, setBattery] = useState(88);
  const [temperature] = useState(22.5);
  const [status, setStatus] = useState("AI Data Routing Active");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const timer = setInterval(() => {
      setBattery((prev) => (prev > 30 ? prev - 1 : 97));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (battery < 70) {
      setStatus("Power Saving Mode");
    } else {
      setStatus("AI Data Routing Active");
    }
  }, [battery]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };

  const renderContent = () => {
    switch (activePage) {
      case "live-api":
        return <LiveData />;

      case "ai":
        return <AIPredictor />;

      case "about":
        return <MissionInfo />;

      case "request":
        return <Forms onLoginSuccess={handleLoginSuccess} />;

      case "dashboard":
      default:
        if (!isLoggedIn) {
          return <Forms onLoginSuccess={handleLoginSuccess} />;
        }

        return (
          <div className="dashboard-container">
            <div className="dashboard-header flex-between">
              <div>
                <h2>{name || "SomaiyaPod Satellite"}</h2>
                <p className="subtitle">
                  Mission Control Portal <span className="code-tag">(KJS-SRS-01)</span>
                </p>
              </div>
              <div className="status-badge green-badge">
                Telemetry Stream Online
              </div>
            </div>

            <h3 className="section-title">Satellite Telemetry Metrics</h3>

            <div className="card-grid">
              <TelemetryCard
                title="Satellite ID"
                value={satelliteid || "CUBESAT-01"}
                subtext="NORAD Tracked"
              />

              <TelemetryCard
                title="System Status"
                value={status}
                subtext="AI Mode: M17 Digital Voice"
                statusColor={battery < 70 ? "warning-text" : "green-text"}
              />

              <TelemetryCard
                title="Battery Power"
                value={`${battery}%`}
                subtext={battery > 70 ? "Solar Charging Nominal" : "Low Power Mode"}
                statusColor={battery > 70 ? "green-text" : "warning-text"}
              />

              <TelemetryCard
                title="Onboard Temperature"
                value={`${temperature} °C`}
                subtext="Thermal Status Nominal"
                statusColor="green-text"
              />

              <TelemetryCard
                title="Orbital Altitude"
                value={orbit || "500 km"}
                subtext="Pass Window: 8 mins"
              />

              <TelemetryCard
                title="RF Frequency"
                value={frequency || "436.500 MHz"}
                subtext="UHF Amateur Radio Band"
              />
            </div>

            <div className="quick-actions-bar">
              <button
                className="secondary-btn"
                onClick={() => setActivePage("live-api")}
              >
                View Live Satellite Tracker API
              </button>
              <button
                className="secondary-btn"
                onClick={() => setActivePage("ai")}
              >
                Run AI Telemetry Diagnostics
              </button>
              <button
                className="secondary-btn"
                onClick={() => setActivePage("about")}
              >
                Mission Technical Specifications
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
        onLogout={() => setIsLoggedIn(false)}
      />

      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default App;