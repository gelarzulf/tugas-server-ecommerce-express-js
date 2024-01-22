const db = require('../config/db');
const bcrypt = require('bcrypt');

const getUsers = async () => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (userData) => {
  try {
    const { username, email, password } = userData;

    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      throw { status: 400, message: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Menambahkan pengguna baru
    await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const { username, email, password } = userData;

    const [existingUser] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (existingUser.length === 0) {
      throw { status: 404, message: 'User not found.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Memperbarui informasi pengguna
    await db.execute('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [username || existingUser[0].username, email || existingUser[0].email, hashedPassword || existingUser[0].password, userId]);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const [existingUser] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (existingUser.length === 0) {
      throw { status: 404, message: 'User not found.' };
    }

    // Menghapus pengguna
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
  } catch (error) {
    throw error;
  }
};

module.exports = { getUsers, getUserById, registerUser, updateUser, deleteUser };
