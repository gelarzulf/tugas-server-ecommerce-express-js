const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, userController.registerUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
