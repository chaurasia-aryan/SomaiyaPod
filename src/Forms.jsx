import React, { useState } from "react";

const mockDatabaseAuth = async (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username && password) {
        resolve({ success: true, user: { username, role: "Operator" } });
      } else {
        resolve({ success: false, message: "Invalid Database Credentials" });
      }
    }, 1000);
  });
};

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    setUsernameError("");
    setPasswordError("");

    if (!username.trim()) {
      setUsernameError("Username is required");
      valid = false;
    } else if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    if (valid) {
      setIsSubmitting(true);
      try {
        const dbResponse = await mockDatabaseAuth(username, password);

        if (dbResponse.success) {
          onLoginSuccess();
        } else {
          setPasswordError(dbResponse.message);
        }
      } catch (err) {
        console.error("DB Auth error:", err);
        setPasswordError("Database connection failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="form-card">
      <h2>Mission Control Login</h2>
      <p className="form-subtitle">Enter your credentials to access telemetry</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username (min 3 chars)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={usernameError ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {usernameError && <span className="error-message">{usernameError}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </div>

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Verifying DB Credentials..." : "Login & Access Dashboard"}
        </button>
      </form>
    </div>
  );
}

function RegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Full Name is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!organization.trim()) {
      setError("Organization is required");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the data terms");
      return;
    }

    setError("");
    setIsSubmitted(true);
  };

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
      <h2>Data Request Registration</h2>
      <p className="form-subtitle">Apply for experimental satellite telemetry access</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder="Your Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            placeholder="email@somaiya.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Organization *</label>
          <input
            type="text"
            placeholder="Institution / Organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

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

        {error && <span className="error-message">{error}</span>}

        <button type="submit" className="primary-btn">
          Submit Request
        </button>
      </form>
    </div>
  );
}

function Forms({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="form-toggle-bar">
        <button
          className={`toggle-tab ${!isRegistering ? "active" : ""}`}
          onClick={() => setIsRegistering(false)}
        >
          Login
        </button>
        <button
          className={`toggle-tab ${isRegistering ? "active" : ""}`}
          onClick={() => setIsRegistering(true)}
        >
          Data Request
        </button>
      </div>

      {isRegistering ? (
        <RegistrationForm />
      ) : (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      )}
    </div>
  );
}

export default Forms;