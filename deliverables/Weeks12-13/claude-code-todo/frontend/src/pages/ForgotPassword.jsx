import React, { useState } from 'react';
import { forgotPassword } from '../utils/auth';

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Enter your email address and the reset link will be printed to the server console.
        </p>

        {error && <div className="error-banner">{error}</div>}
        {message && (
          <div className="success-banner">
            <p>{message}</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Check the backend terminal for the reset link.
            </p>
          </div>
        )}

        {!sent && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <button className="link-btn" onClick={() => onNavigate('login')}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
