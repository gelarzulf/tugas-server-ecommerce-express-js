const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const newProductId = await productService.addProduct({ name, description, price });

    res.status(201).json({ message: 'Product added successfully.', productId: newProductId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price } = req.body;

    await productService.updateProduct(productId, { name, description, price });

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await productService.deleteProduct(productId);

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getReviewsByProductId = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await productService.getReviewsByProductId(productId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addReviewToProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { review, userId } = req.body;

    await productService.addReviewToProduct({ productId, review, userId });

    res.status(201).json({ message: 'Review added successfully.' });
  } catch (error) {
    console.error('Error adding product review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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
