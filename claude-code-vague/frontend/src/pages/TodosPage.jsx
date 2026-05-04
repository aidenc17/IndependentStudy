import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import AddTodoForm from '../components/AddTodoForm';
import TodoList from '../components/TodoList';

export default function TodosPage() {
  const { user, logout, isAdmin } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/todos')
      .then((res) => setTodos(res.data))
      .catch(() => setError('Failed to load todos'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(title) {
    try {
      const res = await client.post('/todos', { title });
      setTodos([res.data, ...todos]);
    } catch {
      setError('Failed to add todo');
    }
  }

  async function handleToggle(id, completed) {
    const prev = todos;
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      const res = await client.patch(`/todos/${id}`, { completed });
      setTodos((cur) => cur.map((t) => (t.id === id ? res.data : t)));
    } catch {
      setTodos(prev);
      setError('Failed to update todo');
    }
  }

  async function handleDelete(id) {
    const prev = todos;
    setTodos(todos.filter((t) => t.id !== id));
    try {
      await client.delete(`/todos/${id}`);
    } catch {
      setTodos(prev);
      setError('Failed to delete todo');
    }
  }

  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>My Tasks</h1>
          <span className="subtitle">
            Welcome, <strong>{user?.username}</strong>
            {isAdmin && <span className="admin-badge">Admin</span>}
          </span>
        </div>
        <nav className="header-nav">
          {isAdmin && <Link to="/users">User List</Link>}
          <button className="link-btn" onClick={logout}>Sign out</button>
        </nav>
      </header>

      <main className="page-main">
        <AddTodoForm onAdd={handleAdd} />
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : (
          <>
            <p className="todo-stats">
              {done} of {todos.length} completed
            </p>
            <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
          </>
        )}
      </main>
    </div>
  );
}
