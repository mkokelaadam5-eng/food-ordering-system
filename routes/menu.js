// Import required modules
const express = require('express');
const { db } = require('../models/database');

const router = express.Router();

// Get all menu items
router.get('/', (req, res) => {
  db.all('SELECT * FROM menu_items ORDER BY category', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch menu items' });
    } else {
      res.json(rows);
    }
  });
});

// Get menu items by category
router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  db.all('SELECT * FROM menu_items WHERE category = ?', [category], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch menu items' });
    } else {
      res.json(rows);
    }
  });
});

// Get single menu item
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM menu_items WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch menu item' });
    } else if (!row) {
      res.status(404).json({ error: 'Menu item not found' });
    } else {
      res.json(row);
    }
  });
});

module.exports = router;
