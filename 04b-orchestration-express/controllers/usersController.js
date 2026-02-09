const fs = require('fs');
const path = require('path');

// Path to our data file
const dataPath = path.join(__dirname, '../data/users.json');

// Helper function to read users from file
const readUsers = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write users to file
const writeUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

// GET /api/users - Get all users
exports.getAllUsers = (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users' });
  }
};

// GET /api/users/:id - Get single user
exports.getUserById = (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read user' });
  }
};

// POST /api/users - Create new user
exports.createUser = (req, res) => {
  try {
    const users = readUsers();
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create new user with auto-increment ID
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};
