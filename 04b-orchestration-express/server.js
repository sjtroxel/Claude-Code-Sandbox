const express = require('express');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/users', usersRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Users API - Orchestration Exercise',
    endpoints: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user (requires name and email in body)'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/users`);
});
