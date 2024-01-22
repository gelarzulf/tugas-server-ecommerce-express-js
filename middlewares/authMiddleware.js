const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/auth');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    jwt.decode(token, { complete: true });
    next();
  } catch (error) {
    console.error('Token decoding error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
