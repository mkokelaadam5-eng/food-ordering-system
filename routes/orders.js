// Import required modules
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../models/database');

const router = express.Router();

// Create new order
router.post('/create', (req, res) => {
  const { customer_name, customer_phone, customer_address, payment_method, items, total_price } = req.body;
  
  // Validate input
  if (!customer_name || !customer_phone || !customer_address || !payment_method || !items || !total_price) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const orderId = uuidv4();
  const itemsJson = JSON.stringify(items);
  
  db.run(
    'INSERT INTO orders (id, customer_name, customer_phone, customer_address, payment_method, total_price, items) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [orderId, customer_name, customer_phone, customer_address, payment_method, total_price, itemsJson],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to create order' });
      } else {
        res.json({ success: true, orderId: orderId, message: 'Order placed successfully' });
      }
    }
  );
});

// Get all orders
router.get('/', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    } else {
      res.json(rows);
    }
  });
});

// Get single order by ID
router.get('/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  
  db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch order' });
    } else if (!row) {
      res.status(404).json({ error: 'Order not found' });
    } else {
      row.items = JSON.parse(row.items);
      res.json(row);
    }
  });
});

// Update order status
router.put('/:orderId/status', (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  
  const validStatuses = ['Pending', 'Preparing', 'On the way', 'Delivered'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to update order status' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Order not found' });
      } else {
        res.json({ success: true, message: 'Order status updated' });
      }
    }
  );
});

module.exports = router;
