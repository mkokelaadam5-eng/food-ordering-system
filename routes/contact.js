// Import required modules
const express = require('express');
const { db } = require('../models/database');

const router = express.Router();

// Submit contact message
router.post('/submit', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required' });
  }
  
  db.run(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || '', subject, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to submit message' });
      } else {
        res.json({ success: true, message: 'Thank you for your message. We will contact you soon!' });
      }
    }
  );
});

// Get all contact messages (for admin)
router.get('/messages', (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
