// Import required modules
const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../models/database');

const router = express.Router();

// Render registration page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Handle user registration
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate input
  if (!name || !email || !password || !confirmPassword) {
    return res.render('register', { error: 'All fields are required' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match' });
  }

  // Check password length
  if (password.length < 6) {
    return res.render('register', { error: 'Password must be at least 6 characters' });
  }

  // Check if email already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.render('register', { error: 'Database error' });
    }

    if (user) {
      return res.render('register', { error: 'Email already registered' });
    }

    // Hash password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user into database
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'customer'],
      function(err) {
        if (err) {
          return res.render('register', { error: 'Registration failed' });
        }

        // Redirect to login after successful registration
        res.redirect('/login?registered=true');
      }
    );
  });
});

// Render login page
router.get('/login', (req, res) => {
  const registered = req.query.registered ? 'Account created successfully! Please log in.' : null;
  res.render('login', { error: null, success: registered });
});

// Handle user login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.render('login', { error: 'Email and password are required', success: null });
  }

  // Find user by email
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.render('login', { error: 'Database error', success: null });
    }

    if (!user) {
      return res.render('login', { error: 'Email or password is incorrect', success: null });
    }

    // Compare password with hashed password
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.render('login', { error: 'Email or password is incorrect', success: null });
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Redirect based on user role
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/');
    }
  });
});

// Handle logout
router.get('/logout', (req, res) => {
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
