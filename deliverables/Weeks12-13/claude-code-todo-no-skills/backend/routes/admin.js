const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// POST /api/admin/bootstrap — promote first admin (only works when no admins exist)
router.post('/bootstrap', async (req, res) => {
  try {
    const { email, adminSecret } = req.body;

    if (!email || !adminSecret) {
      return res.status(400).json({ message: 'Email and adminSecret are required.' });
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin secret.' });
    }

    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return res.status(409).json({ message: 'An admin already exists. Use the admin panel to manage roles.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ message: `${user.username} is now an admin.` });
  } catch (err) {
    console.error('Bootstrap error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// All routes below require auth + admin
router.use(authMiddleware, adminAuthMiddleware);

// GET /api/admin/users — all users with todo counts
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -resetPasswordToken -resetPasswordExpires').lean();

    const todoCounts = await Todo.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    todoCounts.forEach((t) => { countMap[String(t._id)] = t.count; });

    const result = users.map((u) => ({
      ...u,
      todoCount: countMap[String(u._id)] || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

// PUT /api/admin/users/:id/toggle-admin — flip isAdmin
router.put('/users/:id/toggle-admin', async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ message: 'You cannot change your own admin status.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: `${user.username} is now ${user.isAdmin ? 'an admin' : 'a regular user'}.`, isAdmin: user.isAdmin });
  } catch (err) {
    console.error('Toggle admin error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/admin/users/:id — delete user and all their todos
router.delete('/users/:id', async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ message: 'You cannot delete your own account from the admin panel.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await Todo.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: `User ${user.username} and all their todos have been deleted.` });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
