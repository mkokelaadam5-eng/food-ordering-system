// Update navbar to show user name and logout button
function updateNavbar() {
  const navIcons = document.querySelector('.navbar-icons');
  if (!navIcons) return;

  // This is handled by server-side rendering via res.locals.user
  // But we can add client-side enhancements here if needed
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateNavbar();
  
  // Load menu if on menu page
  const menuGrid = document.getElementById('menu-grid');
  if (menuGrid) {
    loadMenu();
  }
  
  // Load cart if on cart page
  const cartContainer = document.getElementById('cart-items');
  if (cartContainer) {
    renderCart();
  }
  
  // Track order if on tracking page
  if (document.getElementById('tracking-result')) {
    trackOrder();
  }
});

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart badge count
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

// Add item to cart
function addToCart(itemId, itemName, itemPrice) {
  const existingItem = cart.find(item => item.id === itemId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: itemId,
      name: itemName,
      price: itemPrice,
      quantity: 1
    });
  }
  
  saveCart();
  showNotification('Item added to cart!', 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  renderCart();
}

// Update item quantity
function updateQuantity(itemId, quantity) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      removeFromCart(itemId);
    } else {
      saveCart();
      renderCart();
    }
  }
}

// Render cart items
function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const summaryTotal = document.getElementById('summary-total');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
    if (summaryTotal) summaryTotal.textContent = '$0.00';
    return;
  }
  
  let html = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    total += parseFloat(itemTotal);
    
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)" style="width: 50px; text-align: center; border: 1px solid #e0e0e0; border-radius: 0.25rem; padding: 0.25rem;">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 600; margin-bottom: 0.5rem;">$${itemTotal}</div>
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Remove</button>
        </div>
      </div>
    `;
  });
  
  cartContainer.innerHTML = html;
  if (summaryTotal) summaryTotal.textContent = '$' + total.toFixed(2);
  
  // Update hidden total for checkout
  const totalInput = document.getElementById('total-price');
  if (totalInput) totalInput.value = total.toFixed(2);
}

// Load and display menu items
function loadMenu(category = null) {
  const url = category ? `/api/menu/category/${category}` : '/api/menu';
  
  fetch(url)
    .then(response => response.json())
    .then(items => {
      const menuGrid = document.getElementById('menu-grid');
      if (!menuGrid) return;
      
      let html = '';
      items.forEach(item => {
        html += `
          <div class="menu-item">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
              <div class="menu-item-category">${item.category}</div>
              <div class="menu-item-name">${item.name}</div>
              <div class="menu-item-description">${item.description || 'Delicious food item'}</div>
              <div class="menu-item-footer">
                <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
              </div>
            </div>
          </div>
        `;
      });
      
      menuGrid.innerHTML = html;
    })
    .catch(error => console.error('Error loading menu:', error));
}

// Submit checkout form
function submitCheckout(event) {
  event.preventDefault();
  
  const name = document.getElementById('customer-name').value;
  const phone = document.getElementById('customer-phone').value;
  const address = document.getElementById('customer-address').value;
  const payment = document.getElementById('payment-method').value;
  const total = parseFloat(document.getElementById('total-price').value);
  
  if (!name || !phone || !address || !payment || cart.length === 0) {
    showNotification('Please fill all fields and add items to cart', 'error');
    return;
  }
  
  const orderData = {
    customer_name: name,
    customer_phone: phone,
    customer_address: address,
    payment_method: payment,
    items: cart,
    total_price: total
  };
  
  fetch('/api/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Save order ID to localStorage for tracking
        localStorage.setItem('lastOrderId', data.orderId);
        // Clear cart
        cart = [];
        saveCart();
        showNotification('Order placed successfully!', 'success');
        // Redirect to order tracking
        setTimeout(() => {
          window.location.href = `/order-tracking?orderId=${data.orderId}`;
        }, 2000);
      } else {
        showNotification('Failed to place order', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showNotification('An error occurred', 'error');
    });
}

// Track order
function trackOrder() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || localStorage.getItem('lastOrderId');
  
  if (!orderId) {
    document.getElementById('tracking-result').innerHTML = '<p style="text-align: center;">No order found. Please place an order first.</p>';
    return;
  }
  
  fetch(`/api/orders/${orderId}`)
    .then(response => response.json())
    .then(order => {
      const statusSteps = ['Pending', 'Preparing', 'On the way', 'Delivered'];
      let html = `
        <div class="order-status-display">
          <h3>Order ID: ${order.id}</h3>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Total:</strong> $${order.total_price.toFixed(2)}</p>
          <p><strong>Delivery Address:</strong> ${order.customer_address}</p>
        </div>
        <div class="status-timeline">
      `;
      
      const currentStatusIndex = statusSteps.indexOf(order.status);
      
      statusSteps.forEach((status, index) => {
        const isActive = index === currentStatusIndex;
        const isCompleted = index < currentStatusIndex;
        
        html += `
          <div class="status-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
            <div class="status-circle">${isCompleted ? '✓' : index + 1}</div>
            <div class="status-label">${status}</div>
          </div>
        `;
      });
      
      html += '</div>';
      document.getElementById('tracking-result').innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('tracking-result').innerHTML = '<p style="text-align: center; color: red;">Order not found</p>';
    });
}

// Submit contact form
function submitContact(event) {
  event.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;
  
  const contactData = {
    name,
    email,
    phone,
    subject,
    message
  };
  
  fetch('/api/contact/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification(data.message, 'success');
        document.querySelector('.contact-form').reset();
      } else {
        showNotification('Failed to send message', 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showNotification('An error occurred', 'error');
    });
}

// Show notification
function showNotification(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '80px';
  alertDiv.style.right = '20px';
  alertDiv.style.zIndex = '1000';
  alertDiv.style.maxWidth = '400px';
  alertDiv.style.animation = 'slideIn 0.3s ease';
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);
