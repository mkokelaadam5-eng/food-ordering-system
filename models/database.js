// Import required modules
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../data/fooddb.sqlite');

// Create or connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  // Create Menu Items table
  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      items TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Contact Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default menu items if not exists
  db.all('SELECT COUNT(*) as count FROM menu_items', (err, result) => {
    if (result[0].count === 0) {
      const defaultMenuItems = [
        // Main Dishes
        { name: 'Grilled Chicken Burger', category: 'Main Dishes', price: 8.99, description: 'Juicy grilled chicken with lettuce and tomato', image: 'https://source.unsplash.com/400x300/?burger' },
        { name: 'Beef Steak', category: 'Main Dishes', price: 12.99, description: 'Premium aged beef steak with herbs', image: 'https://source.unsplash.com/400x300/?steak' },
        { name: 'Pizza Margherita', category: 'Main Dishes', price: 10.99, description: 'Classic pizza with mozzarella and basil', image: 'https://source.unsplash.com/400x300/?pizza' },
        { name: 'Pasta Carbonara', category: 'Main Dishes', price: 9.99, description: 'Creamy pasta with bacon and eggs', image: 'https://source.unsplash.com/400x300/?pasta' },
        { name: 'Grilled Salmon', category: 'Main Dishes', price: 14.99, description: 'Fresh salmon fillet with lemon butter', image: 'https://source.unsplash.com/400x300/?salmon' },
        { name: 'Fried Chicken Platter', category: 'Main Dishes', price: 9.99, description: 'Crispy fried chicken with sides', image: 'https://source.unsplash.com/400x300/?chicken' },
        // Snacks
        { name: 'French Fries', category: 'Snacks', price: 3.99, description: 'Golden crispy french fries', image: 'https://source.unsplash.com/400x300/?fries' },
        { name: 'Chicken Wings', category: 'Snacks', price: 5.99, description: 'Spicy buffalo chicken wings', image: 'https://source.unsplash.com/400x300/?wings' },
        { name: 'Mozzarella Sticks', category: 'Snacks', price: 4.99, description: 'Crispy fried mozzarella cheese sticks', image: 'https://source.unsplash.com/400x300/?cheese' },
        // Drinks
        { name: 'Fresh Orange Juice', category: 'Drinks', price: 2.99, description: 'Freshly squeezed orange juice', image: 'https://source.unsplash.com/400x300/?juice' },
        { name: 'Iced Coffee', category: 'Drinks', price: 3.49, description: 'Cold brew iced coffee with cream', image: 'https://source.unsplash.com/400x300/?coffee' },
        { name: 'Smoothie Bowl', category: 'Drinks', price: 4.99, description: 'Mixed berry smoothie with granola', image: 'https://source.unsplash.com/400x300/?smoothie' },
        // Desserts
        { name: 'Chocolate Cake', category: 'Desserts', price: 5.99, description: 'Rich chocolate layer cake', image: 'https://source.unsplash.com/400x300/?chocolate' },
        { name: 'Ice Cream Sundae', category: 'Desserts', price: 4.99, description: 'Vanilla ice cream with toppings', image: 'https://source.unsplash.com/400x300/?icecream' },
        { name: 'Cheesecake', category: 'Desserts', price: 6.99, description: 'New York style cheesecake', image: 'https://source.unsplash.com/400x300/?cheesecake' }
      ];

      defaultMenuItems.forEach(item => {
        db.run(
          'INSERT INTO menu_items (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.category, item.price, item.description, item.image]
        );
      });
      console.log('Default menu items inserted');
    }
  });
};

// Export database and initialization function
module.exports = {
  db,
  initializeDatabase
};
