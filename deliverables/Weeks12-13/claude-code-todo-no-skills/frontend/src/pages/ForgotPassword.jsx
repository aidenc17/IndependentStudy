import { useState } from 'react';

export default function ForgotPassword({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  const containerStyle = {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '16px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const btnStyle = {
    width: '100%',
    padding: '11px',
    backgroundColor: loading ? '#93c5fd' : '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  if (submitted) {
    return (
      <div style={containerStyle}>
        <h2 style={{ marginBottom: '16px', color: '#1e293b', textAlign: 'center' }}>Check the Server Console</h2>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#dcfce7',
            color: '#166534',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
          }}
        >
          <strong>Reset token printed to server terminal.</strong>
          <br />
          Copy the token from the backend console, then go to the Reset Password page and paste it in.
          <br />
          The token expires in <strong>1 hour</strong>.
        </div>
        <button
          style={btnStyle}
          onClick={() => setCurrentPage('reset-password')}
        >
          Go to Reset Password
        </button>
        <p style={{ marginTop: '16px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
          <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setCurrentPage('login')}>
            Back to Login
          </span>
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '8px', color: '#1e293b', textAlign: 'center' }}>Forgot Password</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginBottom: '24px' }}>
        Enter your email and a reset token will be printed to the server console.
      </p>
      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontSize: '0.9rem' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
          placeholder="you@example.com"
        />
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Token'}
        </button>
      </form>
      <p style={{ marginTop: '16px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
        <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setCurrentPage('login')}>
          Back to Login
        </span>
      </p>
    </div>
  );
}
