import React from "react";

function MissionInfo() {
  return (
    <div className="mission-info-container">
      <div className="page-header">
        <h2>Mission Overview & Technical Specifications</h2>
        <p className="subtitle">SomaiyaPod CubeSat Initiative (KJS-SRS-01)</p>
      </div>

      <div className="mission-grid">
        <div className="card mission-card">
          <div className="card-header-badge">Objectives</div>
          <h3>Primary Mission Goals</h3>
          <ul className="info-list">
            <li>Real-time orbital telemetry broadcast via UHF/VHF bands</li>
            <li>Onboard thermal & battery telemetry monitoring</li>
            <li>AI-driven data packet routing and telemetry compression</li>
            <li>Educational STEM outreach for student satellite developers</li>
          </ul>
        </div>

        <div className="card mission-card">
          <div className="card-header-badge">Hardware</div>
          <h3>CubeSat Technical Specifications</h3>
          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-label">Form Factor:</span>
              <span className="spec-val">1U Standard CubeSat</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Mass:</span>
              <span className="spec-val">1.33 kg</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Primary OBC:</span>
              <span className="spec-val">ARM Cortex-M4 Microcontroller</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Power Subsystem:</span>
              <span className="spec-val">GaAs Solar Cells + Li-ion Battery</span>
            </div>
          </div>
        </div>

        <div className="card mission-card">
          <div className="card-header-badge">Radio & Ground Station</div>
          <h3>Communications Parameters</h3>
          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-label">UHF Downlink:</span>
              <span className="spec-val">436.500 MHz (AX.25 Packet Radio)</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">VHF Beacon:</span>
              <span className="spec-val">145.800 MHz (CW Morse Code)</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Ground Station:</span>
              <span className="spec-val">KJ Somaiya Campus Ground Node</span>
            </div>
          </div>
        </div>

        <div className="card mission-card">
          <div className="card-header-badge">Health Check</div>
          <h3>Subsystem Status Checklist</h3>
          <div className="health-status-list">
            <div className="status-item">
              <span className="dot green"></span>
              <span className="status-name">EPS (Electrical Power)</span>
              <span className="status-tag">Operational</span>
            </div>
            <div className="status-item">
              <span className="dot green"></span>
              <span className="status-name">COMMS (Transceiver)</span>
              <span className="status-tag">Active</span>
            </div>
            <div className="status-item">
              <span className="dot green"></span>
              <span className="status-name">Payload Sensors</span>
              <span className="status-tag">Data Syncing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MissionInfo;
