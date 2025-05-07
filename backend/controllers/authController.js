const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getAllUsers, createUser, getUserByEmail } = require('../models/userModel.js');

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

// Register a new user
const register = async (request, h) => {
  try {
    const { name, email, password, role, reportingManagerId } = request.payload;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return h.response({ error: 'User with this email already exists' }).code(400);
    }

    await createUser(name, email, password, role, reportingManagerId);
    return h.response({ message: 'User Added successfully' }).code(201);
  } catch (err) {
    console.error('Registration error:', err);
    return h.response({ error: 'Internal server error' }).code(500);
  }
};

// Login an existing user
const login = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return h.response({ error: 'Invalid email or password' }).code(400);
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return h.response({ message: 'Login successful', user, token }).code(200);
  } catch (err) {
    console.error('Login error:', err);
    return h.response({ error: 'Internal server error' }).code(500);
  }
};

// Fetch all users
const fetchAllUsers = async (request, h) => {
  try {
    const users = await getAllUsers();
    if (users.length === 0) {
      return h.response({ message: 'No users found.' }).code(404);
    }

    return h.response({ count: users.length, users }).code(200);
  } catch (error) {
    console.error('Fetch users error:', error);
    return h.response({ error: 'Failed to fetch users' }).code(500);
  }
};

module.exports = {
  register,
  login,
  fetchAllUsers,
};
