import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Todos({ setCurrentPage }) {
  const { isLoggedIn, getHeaders } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/todos', { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch todos.');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message || 'Could not load todos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title: newTitle, description: newDesc }),
      });
      if (!res.ok) throw new Error('Failed to create todo.');
      const created = await res.json();
      setTodos([created, ...todos]);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(todo) {
    try {
      const res = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error('Failed to update todo.');
      const updated = await res.json();
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete todo.');
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDesc(todo.description);
  }

  async function handleEditSave(id) {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      if (!res.ok) throw new Error('Failed to update todo.');
      const updated = await res.json();
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  const containerStyle = { maxWidth: '640px', margin: '40px auto', padding: '0 24px' };
  const cardStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    marginBottom: '10px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  };
  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '0.95rem',
    flex: 1,
  };
  const btnSmall = (color) => ({
    padding: '5px 12px',
    backgroundColor: color,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    marginLeft: '4px',
  });

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#1e293b', marginBottom: '24px' }}>My Todos</h1>

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
          <button
            onClick={() => setError('')}
            style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Add Todo Form */}
      <form
        onSubmit={handleAdd}
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo title…"
          style={inputStyle}
          required
        />
        <input
          type="text"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description (optional)"
          style={{ ...inputStyle, flex: '0.8' }}
        />
        <button
          type="submit"
          disabled={adding}
          style={{
            padding: '8px 18px',
            backgroundColor: adding ? '#93c5fd' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: adding ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
          }}
        >
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </form>

      {/* Todo List */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center' }}>Loading todos…</p>
      ) : todos.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center' }}>No todos yet. Add one above!</p>
      ) : (
        todos.map((todo) => (
          <div key={todo._id} style={cardStyle}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
              style={{ marginTop: '4px', cursor: 'pointer', width: '16px', height: '16px', flexShrink: 0 }}
            />
            {editingId === todo._id ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description"
                  style={inputStyle}
                />
                <div>
                  <button style={btnSmall('#22c55e')} onClick={() => handleEditSave(todo._id)}>
                    Save
                  </button>
                  <button style={btnSmall('#64748b')} onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: '500',
                    color: todo.completed ? '#94a3b8' : '#1e293b',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                >
                  {todo.title}
                </p>
                {todo.description && (
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '0.85rem',
                      color: '#64748b',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                    }}
                  >
                    {todo.description}
                  </p>
                )}
              </div>
            )}
            {editingId !== todo._id && (
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button style={btnSmall('#f59e0b')} onClick={() => startEdit(todo)}>
                  Edit
                </button>
                <button style={btnSmall('#ef4444')} onClick={() => handleDelete(todo._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
