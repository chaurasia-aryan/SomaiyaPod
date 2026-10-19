import React, { useState } from "react";

// Real Backend Login Function connected to MongoDB
async function loginUser(username, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await res.json();
}

// Real Backend Registration Function connected to MongoDB
async function registerUser(username, email, password) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return await res.json();
}

function LoginForm({ onLoginSuccess, switchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await loginUser(username.trim(), password);

      if (data.success) {
        // Save token and user in localStorage
        localStorage.setItem("somaiya_token", data.token);
        localStorage.setItem("somaiya_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setErrorMessage("Cannot connect to backend server. Make sure backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setUsername("somaiya_admin");
    setPassword("password123");
    setErrorMessage("");
  };

  return (
    <div className="form-card">
      <h2>Mission Control Login</h2>
      <p className="form-subtitle">Enter your credentials to access SomaiyaPod telemetry</p>

      {errorMessage && (
        <div className="notification-banner" style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", marginBottom: "16px" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username or Email</label>
          <input
            type="text"
            placeholder="Username (e.g. somaiya_admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button type="submit" className="primary-btn" style={{ flex: 1 }} disabled={isSubmitting}>
            {isSubmitting ? "Authenticating..." : "Login & Access Dashboard"}
          </button>
          <button type="button" className="secondary-btn" onClick={handleDemoFill}>
            Demo Operator
          </button>
        </div>
      </form>

      <div style={{ marginTop: "18px", textAlign: "center", fontSize: "0.9rem" }}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          style={{ background: "none", border: "none", color: "var(--primary-blue)", fontWeight: 600, cursor: "pointer" }}
        >
          Register here
        </button>
      </div>
    </div>
  );
}

function RegistrationForm({ onRegisterSuccess, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!username.trim() || !email.trim() || !password) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await registerUser(username.trim(), email.trim(), password);

      if (data.success) {
        setSuccessMessage("Account created successfully! You are now logged in.");
        localStorage.setItem("somaiya_token", data.token);
        localStorage.setItem("somaiya_user", JSON.stringify(data.user));
        setTimeout(() => {
          onRegisterSuccess(data.user);
        }, 1200);
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("Cannot connect to backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Create Operator Account</h2>
      <p className="form-subtitle">Register for MongoDB-backed access to SomaiyaPod telemetry</p>

      {errorMessage && (
        <div className="notification-banner" style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", marginBottom: "16px" }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="notification-banner" style={{ backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", marginBottom: "16px" }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            placeholder="Choose username (min 3 chars)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            placeholder="e.g. operator@somaiya.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: "14px" }} disabled={isSubmitting}>
          {isSubmitting ? "Creating MongoDB Account..." : "Register Account"}
        </button>
      </form>

      <div style={{ marginTop: "18px", textAlign: "center", fontSize: "0.9rem" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          style={{ background: "none", border: "none", color: "var(--primary-blue)", fontWeight: 600, cursor: "pointer" }}
        >
          Login here
        </button>
      </div>
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
          Operator Login
        </button>
        <button
          className={`toggle-tab ${isRegistering ? "active" : ""}`}
          onClick={() => setIsRegistering(true)}
        >
          Register Account
        </button>
      </div>

      {isRegistering ? (
        <RegistrationForm
          onRegisterSuccess={onLoginSuccess}
          switchToLogin={() => setIsRegistering(false)}
        />
      ) : (
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          switchToRegister={() => setIsRegistering(true)}
        />
      )}
    </div>
  );
}

export default Forms;