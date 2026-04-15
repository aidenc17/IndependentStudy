const express = require('express');
const Todo = require('../models/Todo');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// All todo routes require authentication
router.use(verifyToken);

// GET /api/todos — fetch all todos for the logged-in user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/todos — create a new todo
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const todo = await Todo.create({ userId: req.userId, title, description });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/todos/:id — update a todo (toggle complete or edit content)
router.put('/:id', async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/todos/:id — delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
