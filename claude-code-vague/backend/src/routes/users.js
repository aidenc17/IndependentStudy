const express = require('express');
const { getDb } = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

// GET /api/users  (admin only)
router.get('/', (req, res) => {
  const db = getDb();
  const users = db
    .prepare('SELECT id, username, role, created_at FROM users ORDER BY created_at ASC')
    .all();
  res.json(users);
});

module.exports = router;
