const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.post('/', authMiddleware, orderController.addOrder);
router.put('/:id', authMiddleware, orderController.updateOrder);
router.delete('/:id', authMiddleware, orderController.cancelOrder);
router.get('/:id/orders', authMiddleware, orderController.getUserOrders);
router.get('/product/:productId', authMiddleware, orderController.getOrderByProduct);

module.exports = router;
