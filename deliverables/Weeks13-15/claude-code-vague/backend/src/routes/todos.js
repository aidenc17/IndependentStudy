const express = require('express');
const { getDb } = require('../db/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

function formatTodo(row) {
  return { ...row, completed: row.completed === 1 };
}

// GET /api/todos
router.get('/', (req, res) => {
  const db = getDb();
  const todos = db
    .prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id)
    .map(formatTodo);
  res.json(todos);
});

// POST /api/todos
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const db = getDb();
  const result = db
    .prepare('INSERT INTO todos (user_id, title) VALUES (?, ?)')
    .run(req.user.id, title.trim());

  const todo = db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(formatTodo(todo));
});

// PATCH /api/todos/:id
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = getDb();
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

  if (!row) return res.status(404).json({ error: 'Todo not found' });
  if (row.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const { title, completed } = req.body;
  const newTitle = title !== undefined ? title.trim() : row.title;
  const newCompleted = completed !== undefined ? (completed ? 1 : 0) : row.completed;

  db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?')
    .run(newTitle, newCompleted, id);

  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  res.json(formatTodo(updated));
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = getDb();
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);

  if (!row) return res.status(404).json({ error: 'Todo not found' });
  if (row.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  res.json({ success: true });
});

module.exports = router;
