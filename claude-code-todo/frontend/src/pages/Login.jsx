import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/auth';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDevLogin() {
    setError('');
    setLoading(true);
    try {
      const { token, user } = await loginUser('admin@demo.com', 'admin123');
      login(token, user);
      onNavigate('todos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await loginUser(email, password);
      login(token, user);
      onNavigate('todos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1>Log In</h1>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
        <p className="auth-switch">
          <button className="link-btn" onClick={() => onNavigate('forgot-password')}>
            Forgot password?
          </button>
        </p>
        <div className="dev-login-banner">
          <span>Dev mode?</span>
          <button className="btn btn-sm btn-secondary" onClick={handleDevLogin} disabled={loading}>
            Login as Admin
          </button>
        </div>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button className="link-btn" onClick={() => onNavigate('register')}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
