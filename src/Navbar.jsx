import React from "react";

/**
 * Navbar Component
 * 
 * In React, a component is a reusable piece of the user interface.
 * This is a "Functional Component", which is simply a JavaScript function
 * that returns JSX (JavaScript XML), representing what should be displayed on screen.
 * 
 * Props (Properties) can be passed to components to make them dynamic.
 * Here, we pass `title` as a prop to customize the branding text.
 */
function Navbar({ title }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Branding Title */}
        <span className="navbar-logo">{title}</span>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li><a href="#dashboard" className="active">Dashboard</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#docs">Docs</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
