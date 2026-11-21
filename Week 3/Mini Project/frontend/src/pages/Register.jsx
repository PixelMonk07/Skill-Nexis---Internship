
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  }

  return (
    <div className="auth-container">
      <h1>Task Manager</h1>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
