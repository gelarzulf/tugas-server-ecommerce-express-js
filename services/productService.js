const db = require('../config/db');

const getProducts = async () => {
  const [rows] = await db.execute('SELECT * FROM products');
  return rows;
};

const getProductById = async (productId) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
  return rows;
};

const addProduct = async ({ name, description, price }) => {
  const [insertResult] = await db.execute('INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
    [name, description, price]);
  const newProductId = insertResult.insertId;
  return newProductId;
};

const updateProduct = async (productId, { name, description, price }) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);

  if (rows.length === 0) {
    throw new Error('Product not found.');
  }

  await db.execute('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
    [name || rows[0].name, description || rows[0].description, price || rows[0].price, productId]);
};

const deleteProduct = async (productId) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);

  if (rows.length === 0) {
    throw new Error('Product not found.');
  }

  await db.execute('DELETE FROM products WHERE id = ?', [productId]);
};

const getReviewsByProductId = async (productId) => {
  const [rows] = await db.execute('SELECT * FROM product_reviews WHERE productId = ?', [productId]);
  return rows;
};

const addReviewToProduct = async ({ productId, review, userId }) => {
  const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

  if (userRows.length === 0) {
    throw new Error('User not found.');
  }

  const [productRows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);

  if (productRows.length === 0) {
    throw new Error('Product not found.');
  }

  await db.execute('INSERT INTO product_reviews (review, productId, userId) VALUES (?, ?, ?)',
    [review, productId, userId]);
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getReviewsByProductId,
  addReviewToProduct,
};
