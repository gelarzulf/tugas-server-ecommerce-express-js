const orderService = require('../services/orderService');

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders();

    // Restructure the response to include product details and correct total_price
    const formattedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find(o => o.id === order.id);
      if (existingOrder) {
        existingOrder.items.push({
          productId: order.product_id,
          quantity: order.quantity,
          total_price: order.total_price, // Format total_price to two decimal places
        });
      } else {
        const newOrder = {
          id: order.id,
          user_id: order.user_id,
          status: order.status,
          items: [
            {
              productId: order.product_id,
              quantity: order.quantity,
              total_price: order.total_price,
            },
          ],
        };
        acc.push(newOrder);
      }
      return acc;
    }, []);

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);

    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Restructure the response to include product details and correct total_price
    const formattedOrder = order.reduce((acc, item) => {
      acc.id = item.id;
      acc.user_id = item.user_id;
      acc.status = item.status;
      acc.items.push({
        productId: item.product_id,
        quantity: item.quantity,
        total_price: item.total_price,
      });
      return acc;
    }, { items: [] });

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const addOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    await orderService.addUserOrder(userId, items);
    res.status(201).json({ message: 'Order added successfully.' });
  } catch (error) {
    console.error('Error adding order:', error);
    
    if (error.message === 'Invalid request data.') {
      return res.status(400).json({ message: 'Invalid request data.' });
    } else if (error.message === 'User not found.') {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ message: 'Order updated successfully.' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await orderService.cancelOrder(orderId);
    res.status(200).json({ message: 'Order canceled successfully.' });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await orderService.getUserOrders(userId);

    // Restructure the response to include product details and correct total_price
    const formattedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find(o => o.id === order.id);
      if (existingOrder) {
        existingOrder.items.push({
          productId: order.product_id,
          quantity: order.quantity,
          total_price: order.total_price,
        });
      } else {
        const newOrder = {
          id: order.id,
          status: order.status,
          items: [
            {
              productId: order.product_id,
              quantity: order.quantity,
              total_price: order.total_price,
            },
          ],
        };
        acc.push(newOrder);
      }
      return acc;
    }, []);

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getOrderByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const orders = await orderService.getOrdersByProduct(productId);

    // Restructure the response to include product details and correct total_price
    const formattedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find(o => o.id === order.id);
      if (existingOrder) {
        existingOrder.items.push({
          productId: order.product_id,
          quantity: order.quantity,
          total_price: order.total_price,
        });
      } else {
        const newOrder = {
          id: order.id,
          user_id: order.user_id,
          status: order.status,
          items: [
            {
              productId: order.product_id,
              quantity: order.quantity,
              total_price: order.total_price,
            },
          ],
        };
        acc.push(newOrder);
      }
      return acc;
    }, []);

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders by product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = { getOrders, getOrderById, addOrder, updateOrder, cancelOrder, getUserOrders, getOrderByProduct };
