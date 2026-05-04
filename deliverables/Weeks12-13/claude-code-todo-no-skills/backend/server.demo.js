/**
 * Demo server — no MongoDB required.
 * Uses in-memory storage pre-seeded with admin + regular user.
 * Run with: npm run demo
 *
 * Pre-seeded accounts:
 *   Admin : admin@demo.com  / admin123   (has Admin panel)
 *   User  : user@demo.com   / user123
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'demo_jwt_secret';

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ─── In-Memory Store ─────────────────────────────────────────────────────────

function newId() {
  return crypto.randomBytes(12).toString('hex');
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

const adminId = newId();
const userId = newId();

const users = [
  {
    _id: adminId,
    username: 'admin',
    email: 'admin@demo.com',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
  },
  {
    _id: userId,
    username: 'demouser',
    email: 'user@demo.com',
    password: bcrypt.hashSync('user123', 10),
    isAdmin: false,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
  },
];

const todos = [
  { _id: newId(), userId, title: 'Buy groceries', description: '', completed: false, createdAt: new Date() },
  { _id: newId(), userId, title: 'Finish homework', description: 'Chapter 5 exercises', completed: false, createdAt: new Date() },
  { _id: newId(), userId, title: 'Call dentist', description: '', completed: true, createdAt: new Date() },
];

// ─── Middleware ───────────────────────────────────────────────────────────────

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function adminMiddleware(req, res, next) {
  const user = users.find((u) => u._id === req.user.id);
  if (!user || !user.isAdmin) return res.status(403).json({ message: 'Admin access required.' });
  req.fullUser = user;
  next();
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Username, email, and password are required.' });

    if (users.find((u) => u.email === email.toLowerCase() || u.username === username))
      return res.status(409).json({ message: 'Username or email already in use.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      _id: newId(),
      username,
      email: email.toLowerCase(),
      password: hashed,
      isAdmin: false,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: new Date(),
    };
    users.push(user);

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = users.find((u) => u.email === email.toLowerCase());
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = hashToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

      console.log('\n========================================');
      console.log('[PASSWORD RESET] Token generated');
      console.log(`Email:  ${email}`);
      console.log(`Token:  ${rawToken}`);
      console.log('Go to the Reset Password page and enter this token.');
      console.log('Token expires in 1 hour.');
      console.log('========================================\n');
    }

    res.json({ message: 'If that email exists, a reset token has been logged to the server console.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/api/auth/validate-reset-token', (req, res) => {
  const { token } = req.body;
  if (!token) return res.json({ valid: false });

  const hashed = hashToken(token);
  const user = users.find((u) => u.resetPasswordToken === hashed && u.resetPasswordExpires > new Date());
  res.json({ valid: Boolean(user) });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: 'Token and new password are required.' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const hashed = hashToken(token);
    const user = users.find((u) => u.resetPasswordToken === hashed && u.resetPasswordExpires > new Date());
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── Todo Routes ─────────────────────────────────────────────────────────────

app.get('/api/todos', authMiddleware, (req, res) => {
  const userTodos = todos.filter((t) => t.userId === req.user.id).sort((a, b) => b.createdAt - a.createdAt);
  res.json(userTodos);
});

app.post('/api/todos', authMiddleware, (req, res) => {
  const { title, description } = req.body;
  if (!title || !title.trim())
    return res.status(400).json({ message: 'Title is required.' });

  const todo = {
    _id: newId(),
    userId: req.user.id,
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false,
    createdAt: new Date(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', authMiddleware, (req, res) => {
  const todo = todos.find((t) => t._id === req.params.id && t.userId === req.user.id);
  if (!todo) return res.status(404).json({ message: 'Todo not found.' });

  const { title, description, completed } = req.body;
  if (title !== undefined) todo.title = title.trim();
  if (description !== undefined) todo.description = description.trim();
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

app.delete('/api/todos/:id', authMiddleware, (req, res) => {
  const idx = todos.findIndex((t) => t._id === req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Todo not found.' });
  todos.splice(idx, 1);
  res.json({ message: 'Todo deleted.' });
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

app.post('/api/admin/bootstrap', (req, res) => {
  const { email, adminSecret } = req.body;
  if (!email || !adminSecret)
    return res.status(400).json({ message: 'Email and adminSecret are required.' });

  const secret = process.env.ADMIN_SECRET || 'changeme_admin_secret';
  if (adminSecret !== secret)
    return res.status(403).json({ message: 'Invalid admin secret.' });

  if (users.some((u) => u.isAdmin))
    return res.status(409).json({ message: 'An admin already exists.' });

  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.isAdmin = true;
  res.json({ message: `${user.username} is now an admin.` });
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  const result = users.map((u) => ({
    _id: u._id,
    username: u.username,
    email: u.email,
    isAdmin: u.isAdmin,
    createdAt: u.createdAt,
    todoCount: todos.filter((t) => t.userId === u._id).length,
  }));
  res.json(result);
});

app.put('/api/admin/users/:id/toggle-admin', authMiddleware, adminMiddleware, (req, res) => {
  if (req.params.id === req.user.id)
    return res.status(400).json({ message: 'You cannot change your own admin status.' });

  const user = users.find((u) => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.isAdmin = !user.isAdmin;
  res.json({ message: `${user.username} is now ${user.isAdmin ? 'an admin' : 'a regular user'}.`, isAdmin: user.isAdmin });
});

app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  if (req.params.id === req.user.id)
    return res.status(400).json({ message: 'You cannot delete your own account.' });

  const idx = users.findIndex((u) => u._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found.' });

  const username = users[idx].username;
  const removed = todos.filter((t) => t.userId === req.params.id).length;
  users.splice(idx, 1);
  const before = todos.length;
  todos.splice(0, todos.length, ...todos.filter((t) => t.userId !== req.params.id));

  res.json({ message: `User ${username} and ${removed} todo(s) deleted.` });
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'demo' }));

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║         DEMO SERVER (no MongoDB)         ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Backend : http://localhost:${PORT}           ║`);
  console.log('║  Frontend: http://localhost:5173          ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Pre-seeded accounts:                    ║');
  console.log('║  Admin : admin@demo.com / admin123       ║');
  console.log('║  User  : user@demo.com  / user123        ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  NOTE: data resets on server restart     ║');
  console.log('╚══════════════════════════════════════════╝\n');
});
