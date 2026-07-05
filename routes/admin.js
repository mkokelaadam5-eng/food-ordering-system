// Import required modules
const express = require('express');
const { db } = require('../models/database');

const router = express.Router();

// Add new menu item
router.post('/menu/add', (req, res) => {
  const { name, category, price, description, image } = req.body;
  
  // Validate input
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }
  
  db.run(
    'INSERT INTO menu_items (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)',
    [name, category, parseFloat(price), description || '', image || 'https://source.unsplash.com/400x300/?food'],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to add menu item' });
      } else {
        res.json({ success: true, itemId: this.lastID, message: 'Menu item added successfully' });
      }
    }
  );
});

// Delete menu item
router.delete('/menu/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM menu_items WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to delete menu item' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Menu item not found' });
    } else {
      res.json({ success: true, message: 'Menu item deleted successfully' });
    }
  });
});

// Update menu item
router.put('/menu/:id', (req, res) => {
  const id = req.params.id;
  const { name, category, price, description, image } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }
  
  db.run(
    'UPDATE menu_items SET name = ?, category = ?, price = ?, description = ?, image = ? WHERE id = ?',
    [name, category, parseFloat(price), description || '', image || 'https://source.unsplash.com/400x300/?food', id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to update menu item' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Menu item not found' });
      } else {
        res.json({ success: true, message: 'Menu item updated successfully' });
      }
    }
  );
});

// Get all orders (for admin dashboard)
router.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
