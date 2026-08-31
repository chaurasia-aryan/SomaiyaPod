import React from "react";

function Navbar({ title, activePage, setActivePage, isLoggedIn, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div 
          className="navbar-brand" 
          onClick={() => setActivePage("dashboard")} 
          style={{ cursor: "pointer" }}
        >
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
              className={`nav-link ${activePage === "live-api" ? "active" : ""}`}
              onClick={() => setActivePage("live-api")}
            >
              Live API Tracker
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "ai" ? "active" : ""}`}
              onClick={() => setActivePage("ai")}
            >
              AI Diagnostics
            </button>
          </li>

          <li>
            <button
              className={`nav-link ${activePage === "request" ? "active" : ""}`}
              onClick={() => setActivePage("request")}
            >
              Data Request
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

        <div className="navbar-actions">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <button className="login-nav-btn" onClick={() => setActivePage("dashboard")}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
