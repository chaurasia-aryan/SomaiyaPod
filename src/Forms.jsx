// Import React and useState hook for managing input form values
import React, { useState } from "react";

/**
 * 1. LoginForm Component
 * Handles user login input and performs field validation checks.
 */
function LoginForm({ onLoginSuccess }) {
  // Controlled input state for storing username text
  const [username, setUsername] = useState("");
  
  // Controlled input state for storing password text
  const [password, setPassword] = useState("");
  
  // State for storing username validation error message
  const [usernameError, setUsernameError] = useState("");
  
  // State for storing password validation error message
  const [passwordError, setPasswordError] = useState("");

  // Function executed when login form is submitted
  const handleSubmit = (e) => {
    // Prevent default browser page reload on form submit
    e.preventDefault();

    // Variable to track if form validation passes
    let valid = true;

    // Reset error messages before validation check
    setUsernameError("");
    setPasswordError("");

    // Validate username: required and must be at least 3 characters
    if (!username.trim()) {
      setUsernameError("Username is required");
      valid = false;
    } else if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      valid = false;
    }

    // Validate password: required and must be at least 6 characters
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    // If both username and password are valid, call parent success function
    if (valid) {
      onLoginSuccess();
    }
  };

  return (
    <div className="form-card">
      {/* Form title */}
      <h2>Mission Control Login</h2>
      <p className="form-subtitle">Enter your credentials to access telemetry</p>

      {/* Login Form element with custom submit handler */}
      <form onSubmit={handleSubmit}>
        
        {/* Username field group */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username (min 3 chars)"
            value={username}
            // Update username state whenever user types
            onChange={(e) => setUsername(e.target.value)}
            // Add red error border class if error exists
            className={usernameError ? "input-error" : ""}
          />
          {/* Display inline error text if username error exists */}
          {usernameError && <span className="error-message">{usernameError}</span>}
        </div>

        {/* Password field group */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            // Update password state whenever user types
            onChange={(e) => setPassword(e.target.value)}
            // Add red error border class if error exists
            className={passwordError ? "input-error" : ""}
          />
          {/* Display inline error text if password error exists */}
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>

        {/* Submit button */}
        <button type="submit" className="primary-btn">
          Login & Access Dashboard
        </button>
      </form>
    </div>
  );
}

/**
 * 2. RegistrationForm Component
 * Simple registration form for requesting satellite data access.
 */
function RegistrationForm() {
  // Individual state variables for registration fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // State for form validation error message
  const [error, setError] = useState("");
  
  // State to track if request was successfully submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    // Prevent default browser form submission refresh
    e.preventDefault();

    // Check if full name is empty
    if (!fullName.trim()) {
      setError("Full Name is required");
      return;
    }

    // Check if email contains '@' symbol
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if organization is empty
    if (!organization.trim()) {
      setError("Organization is required");
      return;
    }

    // Check if terms checkbox is checked
    if (!agreeTerms) {
      setError("You must agree to the data terms");
      return;
    }

    // Clear error and mark form as submitted
    setError("");
    setIsSubmitted(true);
  };

  // If successfully submitted, render confirmation screen
  if (isSubmitted) {
    return (
      <div className="form-card success-card">
        <h2>Data Access Request Submitted</h2>
        <p>Your research request for SomaiyaPod telemetry has been logged.</p>
        <button className="secondary-btn" onClick={() => setIsSubmitted(false)}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="form-card">
      {/* Registration Header */}
      <h2>Data Request Registration</h2>
      <p className="form-subtitle">Apply for experimental satellite telemetry access</p>

      {/* Form element */}
      <form onSubmit={handleSubmit}>
        
        {/* Full Name field */}
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder="Your Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email field */}
        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            placeholder="email@somaiya.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Organization field */}
        <div className="form-group">
          <label>Organization *</label>
          <input
            type="text"
            placeholder="Institution / Organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        {/* Agree Terms Checkbox */}
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            I agree to the Data Sharing Terms *
          </label>
        </div>

        {/* Display validation error message if any */}
        {error && <span className="error-message">{error}</span>}

        {/* Submit Button */}
        <button type="submit" className="primary-btn">
          Submit Request
        </button>
      </form>
    </div>
  );
}

/**
 * 3. Parent Forms Wrapper Component
 * Manages switching between Login and Registration views.
 */
function Forms({ onLoginSuccess }) {
  // Boolean state tracking whether user is viewing Login or Registration form
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="auth-wrapper">
      {/* Tab toggle buttons bar */}
      <div className="form-toggle-bar">
        
        {/* Button to show Login Form */}
        <button
          className={`toggle-tab ${!isRegistering ? "active" : ""}`}
          onClick={() => setIsRegistering(false)}
        >
          Login
        </button>
        
        {/* Button to show Data Request Registration Form */}
        <button
          className={`toggle-tab ${isRegistering ? "active" : ""}`}
          onClick={() => setIsRegistering(true)}
        >
          Data Request
        </button>
      </div>

      {/* Conditionally render Registration form or Login form */}
      {isRegistering ? (
        <RegistrationForm />
      ) : (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      )}
    </div>
  );
}

// Export Forms component for use in App.jsx
export default Forms;