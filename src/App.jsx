/**
 * App.jsx - Main Application Component
 * 
 * This file contains the root React component of our application. It manages state,
 * handles lifecycle side effects, renders the navigation bar, and controls conditional
 * views (login forms vs. the dashboard telemetry system).
 */

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Forms from "./Forms";
import LiveData from "./API_Intergration";

/**
 * 1. TelemetryCard Component
 * 
 * This is a reusable child component. Instead of writing card layout multiple times,
 * we write it once and customize it using parameters called "Props" ({ title, value, subtext }).
 */
function TelemetryCard({ title, value, subtext }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {/* Short-circuit evaluation: only render subtext if it is provided */}
      {subtext && <div className="card-subtext">{subtext}</div>}
    </div>
  );
}

/**
 * 2. Main App Component
 * 
 * Receives satellite data as props from `main.jsx` (destructured as satelliteid, name, orbit, frequency).
 */
function App({ satelliteid, name, orbit, frequency }) {
  // --- STATE DECLARATIONS ---
  // useState is a React hook that lets components "remember" and update dynamic values.
  // When a state variable changes, React automatically re-renders the component to show updated values.
  
  // `battery` keeps track of the satellite charge. Default value is 88%.
  const [battery, setBattery] = useState(88);
  
  // `temperature` stores onboard temperature. Since there's no updater, it stays constant at 22.5.
  const [temperature] = useState(22.5);
  
  // `status` is a text status updated depending on the battery level.
  const [status, setStatus] = useState("AI Data Routing Active");
  
  // `isLoggedIn` determines if the user is authenticated. Default is false.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- LIFE CYCLE / SIDE EFFECTS (useEffect) ---
  // useEffect tells React that your component needs to do something after rendering.

  /**
   * Effect 1: Battery Discharge Timer Simulation
   * Run only ONCE when the component first mounts (empty dependency array: []).
   * It creates a timer that decreases battery level by 1 every 3 seconds.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      // Functional state update: receives current value and calculates the next one.
      setBattery((prev) => (prev > 30 ? prev - 1 : 97));
    }, 3000);

    // Clean up the timer when the component unmounts to prevent memory leaks.
    return () => clearInterval(timer);
  }, []);

  /**
   * Effect 2: Status update based on battery level
   * This effect runs every time the `battery` state changes (dependent on [battery]).
   */
  useEffect(() => {
    if (battery < 70) {
      setStatus("Power Saving Mode");
    } else {
      setStatus("AI Data Routing Active");
    }
  }, [battery]);

  // --- RENDER RETURN ---
  // The JSX returned by this function describes the UI structure.
  return (
    <>
      {/* 3. Render our brand-new basic Navbar component and pass a dynamic title prop */}
      <Navbar title="OrbitCommand v1.0" />

      <main>
        {/* Render dynamic name prop passed from main.jsx */}
        <h1>{name}!</h1>
        <p className="subtitle">
          Welcome to Mission Control <span className="code-tag">(KJS-SRS-01)</span>
        </p>

        {/* 
          4. CONDITIONAL RENDERING
          Using JavaScript's ternary operator (? :):
          - If the user is NOT logged in (!isLoggedIn), show the login/registration Forms.
          - If the user IS logged in, show the satellite telemetry dashboard and a logout button.
        */}
        {!isLoggedIn ? (
          // We pass a function trigger `onLoginSuccess` to child Form component.
          // When child component calls this, it will set isLoggedIn to true in parent.
          <Forms onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <>
            {/* Log out option */}
            <center>
              <button className="toggle-btn" onClick={() => setIsLoggedIn(false)}>
                Logout
              </button>
            </center>
            
            <h2 className="section-title">Satellite Telemetry Metrics</h2>
            
            {/* Grid display using TelemetryCard components */}
            <div className="card-grid">
              <TelemetryCard title="Satellite ID" value={satelliteid} />
              
              <TelemetryCard
                title="System Status"
                value={status}
                subtext="AI Mode: M17 Digital Voice"
              />
              
              <TelemetryCard
                title="Battery Power"
                value={`${battery}%`}
                subtext="Solar Charging OK"
              />
              
              <TelemetryCard
                title="Onboard Temperature"
                value={`${temperature} °C`}
                subtext="Thermal Status Nominal"
              />
              
              <TelemetryCard
                title="Orbital Altitude"
                value={orbit}
                subtext="Pass Window: 8 mins"
              />
              
              <TelemetryCard
                title="RF Frequency"
                value={frequency}
                subtext="UHF Amateur Radio Band"
              />
              
              {/* Fetches and renders live location data from an external API */}
              <LiveData></LiveData>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;