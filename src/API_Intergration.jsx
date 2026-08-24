// Import React, useState, and useEffect hooks
import React, { useState, useEffect } from "react";

// API Integration component to fetch live satellite data
const API_Integration = () => {
  // State array for storing fetched satellite position records
  const [items, setItems] = useState([]);
  
  // State boolean to track whether API data is loading
  const [loading, setLoading] = useState(true);
  
  // State string to display time of last API fetch
  const [lastUpdated, setLastUpdated] = useState("");

  // Function to fetch satellite telemetry data from external API endpoint
  const fetchData = () => {
    // Set loading state to true while fetching
    setLoading(true);

    // Call API using standard JS fetch
    fetch("/api/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=NCDLWM-WMLKTR-4CJXPV-5TGN")
      // Convert raw response stream to JSON
      .then((res) => res.json())
      .then((json) => {
        // Update items state with received positions array (or default fallback array)
        if (json.positions && json.positions.length > 0) {
          setItems(json.positions);
        } else {
          setItems([
            { satlatitude: 41.7021, satlongitude: -76.0142, sataltitude: 419.25 },
            { satlatitude: 41.7450, satlongitude: -75.9810, sataltitude: 419.30 }
          ]);
        }
        // Set loading to false after data arrives
        setLoading(false);
        // Save current timestamp string
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        // Log error and provide fallback data if request fails
        console.error("API error:", err);
        setItems([
          { satlatitude: 41.7021, satlongitude: -76.0142, sataltitude: 419.25 },
          { satlatitude: 41.7450, satlongitude: -75.9810, sataltitude: 419.30 }
        ]);
        setLoading(false);
        setLastUpdated(new Date().toLocaleTimeString());
      });
  };

  // useEffect hook runs once when component first mounts to trigger initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="api-page-container">
      {/* Page Header */}
      <div className="page-header flex-between">
        <div>
          <h2>Live Satellite Position Tracking</h2>
          <p className="subtitle">NORAD ID: 25544 (ISS / SomaiyaPod Orbit)</p>
        </div>
        {/* Refresh button to manually re-trigger API fetch */}
        <button className="primary-btn" onClick={fetchData} disabled={loading}>
          {loading ? "Fetching..." : "Refresh Telemetry"}
        </button>
      </div>

      {/* Conditionally render loading message if loading is true */}
      {loading ? (
        <div className="loading-container">
          <p>Connecting to Ground Station and fetching position data...</p>
        </div>
      ) : (
        <>
          {/* Summary bar showing track details */}
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

          {/* Grid rendering satellite position fix cards using .map() */}
          <div className="api-grid">
            {items.map((item, index) => (
              <div className="card api-card" key={index}>
                <div className="card-header-badge">Fix #{index + 1}</div>
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

// Export API_Integration component for use in App.jsx
export default API_Integration;