import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ setCurrentPage }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        return;
      }

      login(data.token, data.user);
      setCurrentPage('todos');
    } catch (err) {
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

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '24px', color: '#1e293b', textAlign: 'center' }}>Register</h2>
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
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          required
          placeholder="johndoe"
        />
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
        <label style={{ display: 'block', marginBottom: '4px', color: '#475569', fontSize: '0.9rem' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
          placeholder="Min 6 characters"
        />
        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Registering…' : 'Create Account'}
        </button>
      </form>
      <p style={{ marginTop: '16px', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <span
          style={{ color: '#3b82f6', cursor: 'pointer' }}
          onClick={() => setCurrentPage('login')}
        >
          Login
        </span>
      </p>
    </div>
  );
}
