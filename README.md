# 🍕 FoodHub - Food Ordering System

A complete, fully functional Food Ordering Website built with **Node.js + Express**, **SQLite**, and responsive **HTML/CSS/JavaScript**.

## Features

✅ **Homepage** - Welcome message with call-to-action button  
✅ **Menu Page** - 15+ food items grouped by category (Main Dishes, Snacks, Drinks, Desserts)  
✅ **About Us** - Company description and team section with founder profiles  
✅ **Shopping Cart** - Add/remove items, update quantities, calculate totals  
✅ **Checkout** - Order form with customer details and payment method selection  
✅ **Order Tracking** - Real-time order status (Pending, Preparing, On the way, Delivered)  
✅ **Contact Us** - Contact form and location/support information  
✅ **Admin Dashboard** - Add/delete menu items, manage all orders  
✅ **Customer Testimonials** - Reviews from satisfied customers  
✅ **Responsive Design** - Mobile-friendly and fully optimized for all devices  

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Poppins & Inter fonts from Google Fonts
- **Icons**: Font Awesome 6.4
- **Images**: Unsplash API for dynamic food images

## Folder Structure

```
food-ordering-system/
├── public/                    # Static files
│   ├── css/
│   │   └── style.css         # Main stylesheet (responsive design)
│   └── js/
│       └── app.js            # Frontend JavaScript (cart, menu, forms)
├── views/                     # EJS templates
│   ├── index.ejs             # Homepage
│   ├── menu.ejs              # Menu page
│   ├── about.ejs             # About us page
│   ├── cart.ejs              # Shopping cart
│   ├── checkout.ejs          # Checkout page
│   ├── order-tracking.ejs    # Order tracking
│   ├── contact.ejs           # Contact us
│   ├── admin.ejs             # Admin dashboard
│   └── 404.ejs               # 404 error page
├── routes/                    # Express routes
│   ├── menu.js               # Menu API endpoints
│   ├── cart.js               # Cart validation
│   ├── orders.js             # Order management
│   ├── admin.js              # Admin operations
│   └── contact.js            # Contact form handling
├── models/
│   └── database.js           # SQLite database setup & initialization
├── data/
│   └── fooddb.sqlite         # SQLite database file (auto-created)
├── server.js                 # Main server file
├── package.json              # Dependencies
├── README.md                 # This file
└── .gitignore               # Git ignore file
```

## Installation & Setup

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

### Step 1: Clone the Repository

```bash
git clone https://github.com/mkokelaadam5-eng/food-ordering-system.git
cd food-ordering-system
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express (web framework)
- ejs (template engine)
- sqlite3 (database)
- body-parser (request parsing)
- cors (cross-origin)
- uuid (unique IDs)
- nodemon (dev auto-reload)

### Step 3: Create Database Directory

```bash
mkdir -p data
```

### Step 4: Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 5: Access the Application

Open your browser and navigate to:
- **Main Site**: http://localhost:3000
- **Menu**: http://localhost:3000/menu
- **About**: http://localhost:3000/about
- **Cart**: http://localhost:3000/cart
- **Checkout**: http://localhost:3000/checkout
- **Order Tracking**: http://localhost:3000/order-tracking
- **Contact**: http://localhost:3000/contact
- **Admin Dashboard**: http://localhost:3000/admin

## How It Works

### User Flow

1. **Browse Menu** → Users visit the menu page and filter items by category
2. **Add to Cart** → Click "Add to Cart" button (stored in browser localStorage)
3. **View Cart** → See items, update quantities, remove items
4. **Checkout** → Fill delivery form and select payment method
5. **Place Order** → Order is saved to database with unique ID
6. **Track Order** → View real-time order status

### Admin Flow

1. **Add Menu Items** → Admin dashboard form to add new food items
2. **Delete Items** → Remove items from the menu
3. **View Orders** → See all customer orders
4. **Update Status** → Change order status (Pending → Preparing → On the way → Delivered)

## Database Schema

### menu_items Table
```sql
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### orders Table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'Pending',
  items TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### contact_messages Table
```sql
CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Default Menu Items

### Main Dishes (6 items)
- Grilled Chicken Burger - $8.99
- Beef Steak - $12.99
- Pizza Margherita - $10.99
- Pasta Carbonara - $9.99
- Grilled Salmon - $14.99
- Fried Chicken Platter - $9.99

### Snacks (3 items)
- French Fries - $3.99
- Chicken Wings - $5.99
- Mozzarella Sticks - $4.99

### Drinks (3 items)
- Fresh Orange Juice - $2.99
- Iced Coffee - $3.49
- Smoothie Bowl - $4.99

### Desserts (3 items)
- Chocolate Cake - $5.99
- Ice Cream Sundae - $4.99
- Cheesecake - $6.99

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/:id` - Get single item

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get single order
- `PUT /api/orders/:orderId/status` - Update order status

### Admin
- `POST /api/admin/menu/add` - Add menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `GET /api/admin/orders` - Get all orders

### Contact
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/messages` - Get all messages (admin)

## Design Features

✨ **Color Scheme**: Orange (#ff8c42) and White theme  
✨ **Typography**: Poppins font for modern look  
✨ **Responsive**: Mobile-first design, works on all devices  
✨ **Icons**: Font Awesome for intuitive navigation  
✨ **Images**: Dynamic food images from Unsplash API  
✨ **Animations**: Smooth transitions and hover effects  
✨ **Accessibility**: Semantic HTML and proper labels  

## Deployment

### Deploy to Heroku

1. **Create Heroku account** - [Sign up](https://www.heroku.com)

2. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**:
   ```bash
   heroku login
   ```

4. **Create Procfile** (in project root):
   ```
   web: node server.js
   ```

5. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

7. **Open app**:
   ```bash
   heroku open
   ```

### Deploy to Vercel/Netlify

Note: Netlify is for frontend only. For full-stack deployment, use:
- Heroku (recommended)
- Railway
- Render
- AWS EC2
- DigitalOcean

### Deploy to Railway

1. Connect GitHub repository to [Railway](https://railway.app)
2. Railway auto-detects Node.js and deploys
3. Set environment variables if needed
4. Your app will be live immediately

## Troubleshooting

### Port already in use
```bash
# Change port in server.js line 10
const PORT = 3001; // or any available port
```

### Database not creating
```bash
# Manually create data directory
mkdir -p data
```

### Dependencies not installing
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Images not loading
- Check internet connection (Unsplash API requires online access)
- Images fallback to default Unsplash URL

## Browser Compatibility

✅ Chrome (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  

## Security Notes

⚠️ **For Production Use**:
- Add authentication (login/register)
- Use environment variables for sensitive data
- Implement input validation and sanitization
- Use HTTPS only
- Add rate limiting
- Implement CSRF protection
- Use password hashing for admin access

## License

This project is open source and available under the ISC License.

## Author

**Ahmad Malove** - Founder & CEO of FoodHub

## Team

- 👨‍💼 Ahmad Malove - Founder & CEO
- 👨‍💻 Adamu Ajida Abdalah - Lead Developer
- 👩‍💼 Rehema Nchimbi - Marketing Manager
- 👤 Romelu Lukaku - Customer Relations

## Support

For issues and questions:
- Email: support@foodhub.com
- Phone: +1 (555) 123-4567
- Hours: 24/7

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ by FoodHub Team**
