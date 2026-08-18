/**
 * Forms.jsx - Form Handling Components
 * 
 * This file teaches how React handles user input.
 * In vanilla HTML, inputs maintain their own state. In React, we use "Controlled Components",
 * meaning the input's value is bound to and controlled by React state.
 */

import React, { useState } from "react";

/**
 * 1. LoginForm Component
 * 
 * Shows a username and password field. Utilizes individual states for each input.
 */
function LoginForm({ onLoginSuccess }) {
  // Declare two individual states for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handle form submit event
   */
  const handleSubmit = (e) => {
    // e.preventDefault() stops the page from refreshing on form submission (default browser behavior)
    e.preventDefault();
    
    // Quick validation checks
    if (!username || !password) {
      alert("Please fill in both fields");
    } else {
      // Execute the callback function passed by App.jsx parent component
      onLoginSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Mission Control Login</h2>
      
      {/* 
        Controlled Input:
        - `value={username}`: Displays whatever is stored in the `username` state.
        - `onChange`: Triggers a function whenever the user types.
        - `e.target.value`: Captures what the user typed in the browser and updates state.
      */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      
      <button type="submit" className="toggle-btn">
        Login & View Telemetry
      </button>
    </form>
  );
}

/**
 * 2. RegistrationForm Component
 * 
 * Demonstrates how to manage complex forms with multiple fields using a single state object.
 */
function RegistrationForm() {
  // Instead of 12 separate useStates, we group all registration fields inside one state object.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Researcher",
    organization: "",
    country: "",
    dataType: "Telemetry",
    frequencyBand: "UHF (436.500 MHz)",
    duration: "1 Month",
    reason: "",
    agreeTerms: false,
  });

  /**
   * Generic input handler
   * Uses ES6 computed property names to dynamically update the correct field in the state object.
   */
  const handleChange = (e) => {
    // Extract property fields from the event's target element (the input field itself)
    const { name, value, type, checked } = e.target;
    
    // Update the form state object
    setFormData({
      ...formData, // Spread operator to keep all other existing values unchanged
      [name]: type === "checkbox" ? checked : value, // Dynamically target key and set its new value
    });
  };

  /**
   * Form validation criteria
   */
  const validate = () => {
    if (!formData.fullName.trim()) {
      alert("Full Name is required.");
      return false;
    }
    if (formData.fullName.trim().length < 3) {
      alert("Full Name must be at least 3 characters long.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Email Address is required.");
      return false;
    }
    // Simple email regex pattern check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required.");
      return false;
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone.trim())) {
      alert("Please enter a valid phone number (7-15 digits).");
      return false;
    }

    if (!formData.role) {
      alert("Role selection is required.");
      return false;
    }

    if (!formData.organization.trim()) {
      alert("Organization / Institution is required.");
      return false;
    }

    if (!formData.country.trim()) {
      alert("Country / Region is required.");
      return false;
    }

    if (!formData.dataType) {
      alert("Data payload selection is required.");
      return false;
    }

    if (!formData.frequencyBand) {
      alert("Target frequency band is required.");
      return false;
    }

    if (!formData.duration) {
      alert("Access duration is required.");
      return false;
    }

    if (!formData.reason.trim()) {
      alert("Research justification is required.");
      return false;
    }
    if (formData.reason.trim().length < 15) {
      alert("Research justification must be at least 15 characters long.");
      return false;
    }

    if (!formData.agreeTerms) {
      alert("You must agree to the Data Sharing Terms.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      alert("Data access registration submitted successfully!");
      console.log("Submitted Request Details:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Data Request Registration</h2>

      {/* Inputs use the `name` attribute matching keys in the formData state object */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name *"
        value={formData.fullName}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="email"
        name="email"
        placeholder="Email Address *"
        value={formData.email}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="tel"
        name="phone"
        placeholder="Phone / Contact Number *"
        value={formData.phone}
        onChange={handleChange}
      />
      <br /><br />

      <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Role / Position *</label>
      <br />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="Researcher">Researcher</option>
        <option value="Student">Student</option>
        <option value="Engineer">Engineer / Technician</option>
        <option value="Faculty">Faculty / Educator</option>
        <option value="Guest">Guest / Observer</option>
      </select>
      <br /><br />

      <input
        type="text"
        name="organization"
        placeholder="Organization / Institution *"
        value={formData.organization}
        onChange={handleChange}
      />
      <br /><br />

      <input
        type="text"
        name="country"
        placeholder="Country / Region *"
        value={formData.country}
        onChange={handleChange}
      />
      <br /><br />

      <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Requested Data Payload *</label>
      <br />
      <select name="dataType" value={formData.dataType} onChange={handleChange}>
        <option value="Telemetry">Raw Housekeeping Telemetry</option>
        <option value="Thermal">Thermal Subsystem Logs</option>
        <option value="Orbital">Orbital Ephemeris (TLE)</option>
        <option value="Payload">Payload Beacon Packets</option>
      </select>
      <br /><br />

      <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Target Frequency Band *</label>
      <br />
      <select name="frequencyBand" value={formData.frequencyBand} onChange={handleChange}>
        <option value="UHF (436.500 MHz)">UHF (436.500 MHz)</option>
        <option value="VHF (145.800 MHz)">VHF (145.800 MHz)</option>
        <option value="S-Band (2.4 GHz)">S-Band (2.4 GHz Downlink)</option>
      </select>
      <br /><br />

      <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Access Duration *</label>
      <br />
      <select name="duration" value={formData.duration} onChange={handleChange}>
        <option value="1 Week">1 Week</option>
        <option value="1 Month">1 Month</option>
        <option value="6 Months">6 Months</option>
        <option value="Permanent">Permanent Access</option>
      </select>
      <br /><br />

      <textarea
        name="reason"
        placeholder="Purpose / Research Justification *"
        value={formData.reason}
        onChange={handleChange}
      />
      <br /><br />

      <label style={{ fontSize: "13px", cursor: "pointer" }}>
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          style={{ width: "auto", marginRight: "8px" }}
        />
          I agree to the Orbital Data Sharing Terms *
      </label>
      <br /><br />

      <button type="submit" className="toggle-btn">
        Submit Request
      </button>
    </form>
  );
}

/**
 * 3. Parent Forms Wrapper Component
 * 
 * Manages which form (Login or Register) is active using a toggled boolean state `isRegistering`.
 */
function Forms({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <center>
      {/* Toggle button switching states */}
      <button
        className="refresh-button"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "Switch to Login" : "Switch to Data Request"}
      </button>

      {/* Conditionally render forms based on state toggle */}
      {isRegistering ? (
        <RegistrationForm />
      ) : (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      )}
    </center>
  );
}

export default Forms;