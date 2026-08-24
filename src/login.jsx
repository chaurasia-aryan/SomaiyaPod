import React, { useState } from 'react';

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Fields cannot be empty");
    } else {
      setError("");
      console.log("Login submitted:", { username, password });
    }
  };

  return (
    <center><form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>{error}</p>
    </form>
    </center>
  );
}

function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) alert("Name cannot be empty");
    else if (!email.includes("@")) 
      alert("Invalid email");
    else if (password.length < 6) 
      alert("Password must be at least 6 characters");
    else 
      console.log("Registered:", { name, email, password });
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
