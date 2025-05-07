const {
  getAllUsers: repoGetAllUsers,
  createUser: repoCreateUser,
  getUserByEmail: repoGetUserByEmail,
  getUserById: repoGetUserById
} = require('../repositories/UserRepository');

// Function to get all users, delegates to the repository
const getAllUsers = async () => {
  try {
    const users = await repoGetAllUsers();
    return users;
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    throw new Error('Failed to fetch all users');
  }
};

// Function to create a user, delegates to the repository
const createUser = async (name, email, password, role, managerId) => {
  try {
    const user = await repoCreateUser(name, email, password, role, managerId);
    return user;
  } catch (err) {
    console.error('Error in createUser:', err);
    throw new Error('Failed to create user');
  }
};

// Function to get a user by email, delegates to the repository
const getUserByEmail = async (email) => {
  try {
    const user = await repoGetUserByEmail(email);
    return user;
  } catch (err) {
    console.error('Error in getUserByEmail:', err);
    throw new Error('Failed to fetch user by email');
  }
};

// Function to get a user by ID, delegates to the repository
const getUserById = async (id) => {
  try {
    const user = await repoGetUserById(id);
    return user;
  } catch (err) {
    console.error('Error in getUserById:', err);
    throw new Error('Failed to fetch user by ID');
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserByEmail,
  getUserById
};
