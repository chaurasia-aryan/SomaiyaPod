// Import the React library to write React components
import React from "react";

// Navbar component receives props from parent component (App.jsx)
function Navbar({ title, activePage, setActivePage, isLoggedIn, onLogout }) {
  return (
    // Top navigation container bar
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Brand logo/title: Clicking it resets active page to dashboard */}
        <div 
          className="navbar-brand" 
          onClick={() => setActivePage("dashboard")} 
          style={{ cursor: "pointer" }}
        >
          {/* Displays navbar title passed as a prop */}
          <span className="navbar-logo">{title}</span>
        </div>

        {/* List of navigation page links */}
        <ul className="navbar-links">
          
          {/* Dashboard tab button */}
          <li>
            <button
              className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </button>
          </li>

          {/* Live API Tracker tab button */}
          <li>
            <button
              className={`nav-link ${activePage === "live-api" ? "active" : ""}`}
              onClick={() => setActivePage("live-api")}
            >
              Live API Tracker
            </button>
          </li>

          {/* AI Diagnostics tab button */}
          <li>
            <button
              className={`nav-link ${activePage === "ai" ? "active" : ""}`}
              onClick={() => setActivePage("ai")}
            >
              AI Diagnostics
            </button>
          </li>

          {/* Data Request tab button */}
          <li>
            <button
              className={`nav-link ${activePage === "request" ? "active" : ""}`}
              onClick={() => setActivePage("request")}
            >
              Data Request
            </button>
          </li>

          {/* Mission Info tab button */}
          <li>
            <button
              className={`nav-link ${activePage === "about" ? "active" : ""}`}
              onClick={() => setActivePage("about")}
            >
              Mission Info
            </button>
          </li>
        </ul>

        {/* Auth section: Show logout button if logged in, else show login button */}
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

// Export Navbar component so it can be imported in App.jsx
export default Navbar;
