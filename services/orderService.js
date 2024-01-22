const db = require('../config/db');

const getOrders = async () => {
    const [rows] = await db.execute(`
      SELECT
        orders.*,
        order_statuses.status,
        order_items.product_id,
        order_items.quantity,
        products.price,
        (order_items.quantity * products.price) AS total_price
      FROM
        orders
        JOIN order_statuses ON orders.id = order_statuses.order_id
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
    `);
  
    return rows;
  };
  

  const getOrderById = async (orderId) => {
    const [rows] = await db.execute(`
      SELECT
        orders.*,
        order_statuses.status,
        order_items.product_id,
        order_items.quantity,
        products.price,
        (order_items.quantity * products.price) AS total_price
      FROM
        orders
        JOIN order_statuses ON orders.id = order_statuses.order_id
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
      WHERE
        orders.id = ?
    `, [orderId]);
  
    return rows;
  };
  

const addUserOrder = async (userId, items) => {
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid request data.');
  }

  const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

  if (userRows.length === 0) {
    throw new Error('User not found.');
  }

  const [insertResult] = await db.execute('INSERT INTO orders (user_id) VALUES (?)', [userId]);
  const newOrderId = insertResult.insertId;

  for (const item of items) {
    if (!item.productId || !item.quantity) {
      throw new Error('Invalid order item data.');
    }

    const total_price = item.price * item.quantity;

    await db.execute('INSERT INTO order_items (order_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
      [newOrderId, item.productId, item.quantity, total_price]);
  }

  await db.execute('INSERT INTO order_statuses (order_id, status) VALUES (?, ?)', [newOrderId, 'pending']);
};

const updateOrderStatus = async (orderId, status) => {
  const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);

  if (rows.length === 0) {
    throw new Error('Order not found.');
  }

  if (status) {
    await db.execute('UPDATE order_statuses SET status = ? WHERE order_id = ?', [status, orderId]);
  }
};

const cancelOrder = async (orderId) => {
  const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);

  if (rows.length === 0) {
    throw new Error('Order not found.');
  }

  await db.execute('UPDATE order_statuses SET status = ? WHERE order_id = ?', ['canceled', orderId]);
};

const getUserOrders = async (userId) => {
    const [rows] = await db.execute(`
      SELECT
        orders.*,
        order_statuses.status,
        order_items.product_id,
        order_items.quantity,
        products.price,
        (order_items.quantity * products.price) AS total_price
      FROM
        orders
        JOIN order_statuses ON orders.id = order_statuses.order_id
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
      WHERE
        orders.user_id = ?
    `, [userId]);
  
    return rows;
  };
  
  const getOrdersByProduct = async (productId) => {
    const [rows] = await db.execute(`
      SELECT
        orders.*,
        order_statuses.status,
        order_items.product_id,
        order_items.quantity,
        products.price,
        (order_items.quantity * products.price) AS total_price
      FROM
        orders
        JOIN order_statuses ON orders.id = order_statuses.order_id
        JOIN order_items ON orders.id = order_items.order_id
        JOIN products ON order_items.product_id = products.id
      WHERE
        order_items.product_id = ?
    `, [productId]);
  
    return rows;
  };
  
  module.exports = { getOrders, getOrderById, addUserOrder, updateOrderStatus, cancelOrder, getUserOrders, getOrdersByProduct };
  
