// In-memory dev server — no MongoDB required.
// Pre-seeded admin: email=admin@demo.com  password=admin123
// Run with: node dev-server.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 7331;
const JWT_SECRET = 'dev_secret_not_for_production';

app.use(cors());
app.use(express.json());

// ── In-memory stores ──────────────────────────────────────────────────────────

let users = [];
let todos = [];
let nextUserId = 2;
let nextTodoId = 1;

// Seed admin account
(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  users.push({
    _id: '1',
    username: 'admin',
    email: 'admin@demo.com',
    password: hash,
    isAdmin: true,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date().toISOString(),
  });
  // Seed a couple of sample todos
  todos.push(
    { _id: '1', userId: '1', title: 'Welcome to TodoApp!', description: 'This is a demo todo.', completed: false, createdAt: new Date().toISOString() },
    { _id: '2', userId: '1', title: 'Try the admin panel', description: 'Click Admin in the navbar.', completed: false, createdAt: new Date().toISOString() }
  );
  nextTodoId = 3;
})();

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId() {
  return String(nextUserId++);
}

function makeTodoId() {
  return String(nextTodoId++);
}

function verifyToken(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function verifyAdmin(req, res, next) {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u._id === decoded.id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ── Auth routes ───────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (users.find((u) => u.email === email.toLowerCase() || u.username === username)) {
    return res.status(409).json({ message: 'Username or email already in use' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = {
    _id: makeId(),
    username,
    email: email.toLowerCase(),
    password: hash,
    isAdmin: false,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = users.find((u) => u.email === email.toLowerCase());
  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    const resetUrl = `http://localhost:7332/?page=reset-password&token=${rawToken}`;
    console.log('\n=== PASSWORD RESET LINK ===');
    console.log(`User:    ${user.email}`);
    console.log(`Link:    ${resetUrl}`);
    console.log('Expires: 1 hour from now');
    console.log('===========================\n');
  }
  res.json({ message: 'If that email exists, a reset link has been logged to the server console.' });
});

app.post('/api/auth/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = users.find((u) => u.resetPasswordToken === hashed && u.resetPasswordExpires > Date.now());
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  res.json({ message: 'Password reset successful. You can now log in.' });
});

// ── Todo routes ───────────────────────────────────────────────────────────────

app.get('/api/todos', verifyToken, (req, res) => {
  const userTodos = todos.filter((t) => t.userId === req.userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userTodos);
});

app.post('/api/todos', verifyToken, (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const todo = { _id: makeTodoId(), userId: req.userId, title, description: description || '', completed: false, createdAt: new Date().toISOString() };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', verifyToken, (req, res) => {
  const todo = todos.find((t) => t._id === req.params.id && t.userId === req.userId);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  const { title, description, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

app.delete('/api/todos/:id', verifyToken, (req, res) => {
  const idx = todos.findIndex((t) => t._id === req.params.id && t.userId === req.userId);
  if (idx === -1) return res.status(404).json({ message: 'Todo not found' });
  todos.splice(idx, 1);
  res.json({ message: 'Todo deleted' });
});

// ── Admin routes ──────────────────────────────────────────────────────────────

app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  res.json({
    userCount: users.length,
    todoCount: todos.length,
    adminCount: users.filter((u) => u.isAdmin).length,
    completedCount: todos.filter((t) => t.completed).length,
  });
});

app.get('/api/admin/users', verifyAdmin, (req, res) => {
  const result = users
    .map(({ password, resetPasswordToken, resetPasswordExpires, ...u }) => ({
      ...u,
      todoCount: todos.filter((t) => t.userId === u._id).length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

app.put('/api/admin/users/:id/toggle-admin', verifyAdmin, (req, res) => {
  const user = users.find((u) => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user._id === req.userId) return res.status(400).json({ message: 'Cannot change your own admin status' });
  user.isAdmin = !user.isAdmin;
  res.json({ message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`, isAdmin: user.isAdmin });
});

app.delete('/api/admin/users/:id', verifyAdmin, (req, res) => {
  const idx = users.findIndex((u) => u._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  if (users[idx]._id === req.userId) return res.status(400).json({ message: 'Cannot delete your own account' });
  todos = todos.filter((t) => t.userId !== req.params.id);
  users.splice(idx, 1);
  res.json({ message: 'User and their todos deleted successfully' });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'in-memory' }));

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\nDev server running on port ${PORT} (in-memory, no MongoDB)`);
  console.log('Pre-seeded admin account:');
  console.log('  Email:    admin@demo.com');
  console.log('  Password: admin123\n');
});
