import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel({ setCurrentPage }) {
  const { getHeaders, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', { headers: getHeaders() });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to load users.');
        return;
      }
      setUsers(data);
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(userId) {
    setActionMsg('');
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg(data.message || 'Action failed.');
        return;
      }
      setActionMsg(data.message);
      setUsers((prev) =>
        prev.map((u) => (String(u._id) === String(userId) ? { ...u, isAdmin: data.isAdmin } : u))
      );
    } catch {
      setActionMsg('Network error.');
    }
  }

  async function deleteUser(userId, username) {
    if (!window.confirm(`Delete user "${username}" and all their todos? This cannot be undone.`)) return;
    setActionMsg('');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg(data.message || 'Delete failed.');
        return;
      }
      setActionMsg(data.message);
      setUsers((prev) => prev.filter((u) => String(u._id) !== String(userId)));
    } catch {
      setActionMsg('Network error.');
    }
  }

  const pageStyle = {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 16px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    fontSize: '0.95rem',
    verticalAlign: 'middle',
  };

  const badgeStyle = (isAdmin) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '600',
    backgroundColor: isAdmin ? '#dbeafe' : '#f1f5f9',
    color: isAdmin ? '#1d4ed8' : '#64748b',
  });

  const actionBtnStyle = (variant) => ({
    padding: '5px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '500',
    marginRight: '6px',
    backgroundColor: variant === 'danger' ? '#fee2e2' : '#e0f2fe',
    color: variant === 'danger' ? '#dc2626' : '#0369a1',
  });

  const disabledBtnStyle = {
    padding: '5px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'not-allowed',
    fontSize: '0.82rem',
    fontWeight: '500',
    marginRight: '6px',
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '1.6rem' }}>Admin Panel</h1>
          {!loading && (
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              {users.length} {users.length === 1 ? 'user' : 'users'} registered
            </p>
          )}
        </div>
        <button
          onClick={fetchUsers}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            cursor: 'pointer',
            color: '#475569',
            fontSize: '0.9rem',
          }}
        >
          Refresh
        </button>
      </div>

      {actionMsg && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            backgroundColor: '#dcfce7',
            color: '#166534',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          {actionMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading users…</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Todos</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => {
              const isSelf = String(u._id) === String(user?.id);
              return (
                <tr key={u._id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={tdStyle}>
                    <strong>{u.username}</strong>
                    {isSelf && (
                      <span style={{ color: '#94a3b8', fontSize: '0.78rem', marginLeft: '6px' }}>(you)</span>
                    )}
                  </td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(u.isAdmin)}>{u.isAdmin ? 'Admin' : 'User'}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{u.todoCount}</td>
                  <td style={{ ...tdStyle, fontSize: '0.85rem', color: '#64748b' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    {isSelf ? (
                      <>
                        <button style={disabledBtnStyle} disabled title="Cannot modify your own account">
                          Toggle Admin
                        </button>
                        <button style={disabledBtnStyle} disabled title="Cannot delete your own account">
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={actionBtnStyle('info')}
                          onClick={() => toggleAdmin(u._id)}
                        >
                          {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          style={actionBtnStyle('danger')}
                          onClick={() => deleteUser(u._id, u.username)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
