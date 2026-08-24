// Import React library and useState hook
import React, { useState } from 'react';

// Basic Login Form component
function LoginForm() {
  // Controlled input states for username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    // Prevent default browser form refresh
    e.preventDefault();
    // Simple validation check
    if (!username || !password) {
      setError("Fields cannot be empty");
    } else {
      setError("");
      console.log("Login submitted:", { username, password });
    }
  };

  return (
    <center>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </center>
  );
}

// Basic Registration Form component
function RegistrationForm() {
  // Controlled input states for name, email, and password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle registration submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) alert("Name cannot be empty");
    else if (!email.includes("@")) alert("Invalid email");
    else if (password.length < 6) alert("Password must be at least 6 characters");
    else console.log("Registered:", { name, email, password });
  };

  return (
    <center>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </center>
  );
}

// Parent Forms Wrapper
function Forms() {
  return (
    <center>
      <div>
        <LoginForm />
        <RegistrationForm />
      </div>
    </center>
  );
}

export default Forms;
