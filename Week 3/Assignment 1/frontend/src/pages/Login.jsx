import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">T</div>
        <p className="eyebrow">Welcome back</p>
        <h1 id="login-title">Sign in to Todo</h1>
        <p className="auth-subtitle">Keep your tasks organized and within reach.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={form.email} required autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} required autoComplete="current-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}