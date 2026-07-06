// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const db = require('./models/database');

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware - configure session storage
app.use(session({
  secret: 'foodhub-secret-key-change-in-production', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make user data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Initialize database
db.initializeDatabase();

// Authentication Routes
app.use('/', authRoutes);

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Render pages
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/order-tracking', (req, res) => {
  res.render('order-tracking');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// Admin route with authentication middleware
app.get('/admin', (req, res) => {
  // Check if user is logged in and is an admin
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  res.render('admin');
});

// 404 error handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🍽️  Food Ordering System running on http://localhost:${PORT}`);
  console.log(`\n📝 Demo Admin Login:`);
  console.log(`   Email: admin@foodhub.com`);
  console.log(`   Password: admin123\n`);
});
