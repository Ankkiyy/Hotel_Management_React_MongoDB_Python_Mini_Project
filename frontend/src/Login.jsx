import React, { useState } from "react";
import { loginEmployee } from './api.js';
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const response = await loginEmployee({ email, password });
      if (response.data.success) {
        // Redirect to rooms page after successful login
        if (response.data.success) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          history("/rooms");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
