const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    await userService.registerUser(userData);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ message: error.message });
    } else {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    await userService.updateUser(userId, userData);
    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ message: error.message });
    } else {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ message: error.message });
    } else {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = { getUsers, getUserById, registerUser, updateUser, deleteUser };
