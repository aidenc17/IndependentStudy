import { useState } from 'react';

export default function ResetPassword({ setCurrentPage }) {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // Validate token first
      const validateRes = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });
      const validateData = await validateRes.json();

      if (!validateData.valid) {
        setError('This reset token is invalid or has expired. Please request a new one.');
        setLoading(false);
        return;
      }

      // Perform the reset
      const resetRes = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });
      const resetData = await resetRes.json();

      if (!resetRes.ok) {
        setError(resetData.message || 'Password reset failed.');
        return;
      }

      setSuccess(true);
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

  if (success) {
    return (
      <div style={containerStyle}>
        <h2 style={{ marginBottom: '16px', color: '#1e293b', textAlign: 'center' }}>Password Reset!</h2>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#dcfce7',
            color: '#166534',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.95rem',
          }}
        >
          Your password has been reset successfully. You can now log in with your new password.
        </div>
        <button style={btnStyle} onClick={() => setCurrentPage('login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '8px', color: '#1e293b', textAlign: 'center' }}>Reset Password</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginBottom: '24px' }}>
        Paste the token from the server console below.
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
          Reset Token
        </label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.85rem' }}
          required
          placeholder="Paste token from server console"
        />
        <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontSize: '0.9rem' }}>
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
          required
          placeholder="At least 6 characters"
          minLength={6}
        />
        <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontSize: '0.9rem' }}>
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
          required
          placeholder="Repeat new password"
        />
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
      <p style={{ marginTop: '16px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
        <span
          style={{ color: '#3b82f6', cursor: 'pointer' }}
          onClick={() => setCurrentPage('forgot-password')}
        >
          Request a new token
        </span>
        {' · '}
        <span style={{ color: '#3b82f6', cursor: 'pointer' }} onClick={() => setCurrentPage('login')}>
          Back to Login
        </span>
      </p>
    </div>
  );
}
