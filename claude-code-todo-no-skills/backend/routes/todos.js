const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// GET /api/todos — get all todos for authenticated user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error('Get todos error:', err);
    res.status(500).json({ message: 'Server error fetching todos.' });
  }
});

// POST /api/todos — create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const todo = new Todo({
      userId: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error('Create todo error:', err);
    res.status(500).json({ message: 'Server error creating todo.' });
  }
});

// PUT /api/todos/:id — update a todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).json({ message: 'Server error updating todo.' });
  }
});

// DELETE /api/todos/:id — delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found.' });
    }
    res.json({ message: 'Todo deleted.' });
  } catch (err) {
    console.error('Delete todo error:', err);
    res.status(500).json({ message: 'Server error deleting todo.' });
  }
});

module.exports = router;
