const express = require('express');
const User = require('../models/User');
const Todo = require('../models/Todo');
const verifyAdmin = require('../middleware/admin');

const router = express.Router();

router.use(verifyAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [userCount, todoCount, adminCount, completedCount] = await Promise.all([
      User.countDocuments(),
      Todo.countDocuments(),
      User.countDocuments({ isAdmin: true }),
      Todo.countDocuments({ completed: true }),
    ]);
    res.json({ userCount, todoCount, adminCount, completedCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(
      {},
      '-password -resetPasswordToken -resetPasswordExpires'
    ).sort({ createdAt: -1 });

    const todoCounts = await Todo.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const todoCountMap = {};
    todoCounts.forEach(({ _id, count }) => {
      todoCountMap[_id.toString()] = count;
    });

    const usersWithCounts = users.map((u) => ({
      ...u.toObject(),
      todoCount: todoCountMap[u._id.toString()] || 0,
    }));

    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/users/:id/toggle-admin
router.put('/users/:id/toggle-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot change your own admin status' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({
      message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await Todo.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their todos deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
