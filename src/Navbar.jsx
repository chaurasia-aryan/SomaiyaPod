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
              // Apply 'active' CSS class if current activePage is 'dashboard'
              className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
              // Update active page state when clicked
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </button>
          </li>

          {/* Live API Tracker tab button */}
          <li>
            <button
              // Apply 'active' CSS class if current activePage is 'live-api'
              className={`nav-link ${activePage === "live-api" ? "active" : ""}`}
              // Update active page state when clicked
              onClick={() => setActivePage("live-api")}
            >
              Live API Tracker
            </button>
          </li>

          {/* Data Request tab button */}
          <li>
            <button
              // Apply 'active' CSS class if current activePage is 'request'
              className={`nav-link ${activePage === "request" ? "active" : ""}`}
              // Update active page state when clicked
              onClick={() => setActivePage("request")}
            >
              Data Request
            </button>
          </li>

          {/* Mission Info tab button */}
          <li>
            <button
              // Apply 'active' CSS class if current activePage is 'about'
              className={`nav-link ${activePage === "about" ? "active" : ""}`}
              // Update active page state when clicked
              onClick={() => setActivePage("about")}
            >
              Mission Info
            </button>
          </li>
        </ul>

        {/* Auth section: Show logout button if logged in, else show login button */}
        <div className="navbar-actions">
          {isLoggedIn ? (
            // Call onLogout function passed from App component when clicked
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          ) : (
            // Switch to login/dashboard view when clicked
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
