import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="brand-mark" aria-hidden="true">T</div>
        <p className="eyebrow">Start organizing</p>
        <h1 id="register-title">Create your account</h1>
        <p className="auth-subtitle">A calmer way to plan your day.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input id="name" value={form.name} required autoComplete="name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" />
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={form.email} required autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} required minLength={6} autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}