// Import React core library and standard hooks (useState for state, useEffect for side effects)
import React, { useState, useEffect } from "react";

// Import child page components
import Navbar from "./Navbar";
import Forms from "./Forms";
import LiveData from "./API_Intergration";
import MissionInfo from "./MissionInfo";
import AIPredictor from "./AIPredictor";

/**
 * TelemetryCard Component
 * Reusable card to display satellite telemetry values (battery, altitude, temp, etc.)
 */
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

/**
 * Main App Component
 * Receives satellite initial properties (satelliteid, name, orbit, frequency) from main.jsx
 */
function App({ satelliteid, name, orbit, frequency }) {
  // State 1: Battery level percentage (default 88%)
  const [battery, setBattery] = useState(88);

  // State 2: Constant onboard temperature value
  const [temperature] = useState(22.5);

  // State 3: Operational status message string
  const [status, setStatus] = useState("AI Data Routing Active");

  // State 4: Boolean flag tracking if user is logged in (default false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State 5: Active navigation tab page string ('dashboard', 'live-api', 'ai', 'request', 'about')
  const [activePage, setActivePage] = useState("dashboard");

  /**
   * Effect 1: Battery discharge timer simulation
   * Runs once on component mount. Decreases battery by 1 every 3 seconds.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setBattery((prev) => (prev > 30 ? prev - 1 : 97));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Effect 2: Update status text based on battery percentage
   * Re-runs whenever battery state changes.
   */
  useEffect(() => {
    if (battery < 70) {
      setStatus("Power Saving Mode");
    } else {
      setStatus("AI Data Routing Active");
    }
  }, [battery]);

  // Callback function triggered when login form validates successfully
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };

  // Helper function returning JSX content for the selected page tab
  const renderContent = () => {
    switch (activePage) {
      // Render Live API Tracker page
      case "live-api":
        return <LiveData />;

      // Render AI Telemetry Diagnostics page
      case "ai":
        return <AIPredictor />;

      // Render Mission Info page
      case "about":
        return <MissionInfo />;

      // Render Data Request registration page
      case "request":
        return <Forms onLoginSuccess={handleLoginSuccess} />;

      // Default view: Dashboard
      case "dashboard":
      default:
        if (!isLoggedIn) {
          return <Forms onLoginSuccess={handleLoginSuccess} />;
        }

        return (
          <div className="dashboard-container">
            {/* Dashboard Header */}
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

            {/* Grid display rendering TelemetryCard components */}
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

            {/* Quick page switch buttons */}
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
      {/* Top Navbar */}
      <Navbar
        title="SomaiyaPod Mission Control"
        activePage={activePage}
        setActivePage={setActivePage}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main page content container */}
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

// Export App component as default export for main.jsx
export default App;