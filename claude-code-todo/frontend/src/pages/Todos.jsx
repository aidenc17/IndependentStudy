import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../utils/auth';

export default function Todos({ onNavigate }) {
  const { token, isLoggedIn } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Guard: redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) onNavigate('login');
  }, [isLoggedIn]);

  // Load todos on mount
  useEffect(() => {
    if (!token) return;
    loadTodos();
  }, [token]);

  async function loadTodos() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTodos(token);
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError('');
    try {
      const created = await createTodo(token, newTitle.trim(), newDesc.trim());
      setTodos([created, ...todos]);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    setError('');
    try {
      const updated = await updateTodo(token, todo._id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t._id === todo._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDesc(todo.description);
  }

  async function handleSaveEdit(id) {
    setError('');
    try {
      const updated = await updateTodo(token, id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
      });
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await deleteTodo(token, id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!isLoggedIn) return null;

  return (
    <div className="page todos-page">
      <h1>My Todos</h1>

      {error && <div className="error-banner">{error}</div>}

      {/* Create form */}
      <form onSubmit={handleCreate} className="todo-create-form">
        <input
          type="text"
          placeholder="New task title…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          className="todo-input"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </form>

      {/* Todo list */}
      {loading ? (
        <p className="loading-text">Loading todos…</p>
      ) : todos.length === 0 ? (
        <p className="empty-text">No todos yet — add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
              {editingId === todo._id ? (
                <div className="todo-edit">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="todo-input"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="todo-input"
                  />
                  <div className="todo-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(todo._id)}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="todo-row">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    className="todo-checkbox"
                  />
                  <div className="todo-text">
                    <span className="todo-title">{todo.title}</span>
                    {todo.description && (
                      <span className="todo-desc">{todo.description}</span>
                    )}
                  </div>
                  <div className="todo-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(todo._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
