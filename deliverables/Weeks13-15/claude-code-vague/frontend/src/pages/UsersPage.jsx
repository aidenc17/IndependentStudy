import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import UserList from '../components/UserList';

export default function UsersPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/todos');
      return;
    }
    client.get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>All Users</h1>
          <span className="subtitle">{users.length} registered</span>
        </div>
        <nav className="header-nav">
          <Link to="/todos">My Tasks</Link>
          <button className="link-btn" onClick={logout}>Sign out</button>
        </nav>
      </header>

      <main className="page-main">
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : (
          <UserList users={users} />
        )}
      </main>
    </div>
  );
}
