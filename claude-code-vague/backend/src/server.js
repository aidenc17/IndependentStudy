require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Initialize DB before starting the server
init().then(() => {
  const authRoutes = require('./routes/auth');
  const todoRoutes = require('./routes/todos');
  const userRoutes = require('./routes/users');

  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);
  app.use('/api/users', userRoutes);

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
