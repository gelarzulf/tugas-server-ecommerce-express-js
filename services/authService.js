const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secretKey } = require('../config/auth');

const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
};

const createUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [insertResult] = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
  return insertResult.insertId;
};

const generateToken = (userId, email, expiresIn) => {
  return jwt.sign({ id: userId, email }, secretKey, { expiresIn });
};

module.exports = { getUserByEmail, createUser, generateToken };
