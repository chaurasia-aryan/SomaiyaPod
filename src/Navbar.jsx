import React from "react";

function Navbar({ title, activePage, setActivePage, isLoggedIn, currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div 
          className="navbar-brand" 
          onClick={() => setActivePage("dashboard")} 
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontSize: "1.3rem" }}>🛰️</span>
          <span className="navbar-logo">{title}</span>
        </div>

        <ul className="navbar-links">
          <li>
            <button
              className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "data" ? "active" : ""}`}
              onClick={() => setActivePage("data")}
            >
              📊 Telemetry Data
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "charts" ? "active" : ""}`}
              onClick={() => setActivePage("charts")}
            >
              📈 Graphs &amp; Charts
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "ai" ? "active" : ""}`}
              onClick={() => setActivePage("ai")}
            >
              ✨ AI (Gemini)
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "live-api" ? "active" : ""}`}
              onClick={() => setActivePage("live-api")}
            >
              Live API Tracker
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "about" ? "active" : ""}`}
              onClick={() => setActivePage("about")}
            >
              Mission Info
            </button>
          </li>
        </ul>

        <div className="navbar-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isLoggedIn ? (
            <>
              <span className="user-profile-badge">
                👤 {currentUser?.username || "Operator"}
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-nav-btn" onClick={() => setActivePage("auth")}>
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
