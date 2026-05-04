import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminStats, fetchAdminUsers, toggleAdminUser, deleteAdminUser } from '../utils/auth';

export default function Admin({ onNavigate }) {
  const { token, user, isLoggedIn } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user?.isAdmin) {
      onNavigate('home');
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [statsData, usersData] = await Promise.all([
        fetchAdminStats(token),
        fetchAdminUsers(token),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAdmin(userId) {
    setActionMsg('');
    try {
      const data = await toggleAdminUser(token, userId);
      setActionMsg(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: data.isAdmin } : u))
      );
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(userId, username) {
    if (!confirm(`Delete user "${username}" and all their todos? This cannot be undone.`)) return;
    setActionMsg('');
    try {
      const data = await deleteAdminUser(token, userId);
      setActionMsg(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!isLoggedIn || !user?.isAdmin) return null;

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p style={{ color: '#666' }}>Logged in as <strong>{user.username}</strong></p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {actionMsg && <div className="success-banner">{actionMsg}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.userCount}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.adminCount}</div>
                <div className="stat-label">Admins</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.todoCount}</div>
                <div className="stat-label">Total Todos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.completedCount}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          )}

          <div className="admin-section">
            <h2>All Users</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Todos</th>
                    <th>Admin</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className={u._id === user.id ? 'current-user-row' : ''}>
                      <td>
                        {u.username}
                        {u._id === user.id && (
                          <span className="you-badge"> (you)</span>
                        )}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.todoCount}</td>
                      <td>
                        <span className={`badge ${u.isAdmin ? 'badge-admin' : 'badge-user'}`}>
                          {u.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="action-cell">
                        {u._id !== user.id && (
                          <>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleToggleAdmin(u._id)}
                            >
                              {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(u._id, u.username)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
