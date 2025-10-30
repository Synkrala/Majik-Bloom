// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Cart functionality
    initializeCart();
    
    // Product gallery functionality
    initializeProductGallery();
    
    // Tab functionality
    initializeTabs();
    
    // Form validation
    initializeFormValidation();
});

// Cart Management
let cart = JSON.parse(localStorage.getItem('majikBloomCart')) || [];

function initializeCart() {
    updateCartCount();
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
    
    // Cart page functionality
    if (document.querySelector('.cart-page')) {
        renderCartItems();
        setupCartInteractions();
    }
}

function addToCart(productId) {
    // In a real app, you would fetch product details from a database
    // For this demo, we'll use mock data
    const products = {
        '1': { id: 1, name: 'Enchanted Empress', price: 49.99, image: 'https://images.unsplash.com/photo-1600857062243-301a450352c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
        '2': { id: 2, name: 'Dragon\'s Breath OG', price: 54.99, image: 'https://images.unsplash.com/photo-1567436864655-7c5d74a373e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
        '3': { id: 3, name: 'Celestial Kush', price: 59.99, image: 'https://images.unsplash.com/photo-1570475735025-6cd1a5c5c0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
    };
    
    const product = products[productId];
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('majikBloomCart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation message
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (cart.length === 0) {
        if (cartTableBody) cartTableBody.innerHTML = '';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    
    if (cartTableBody) {
        cartTableBody.innerHTML = '';
        
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                </td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span></td>
            `;
            cartTableBody.appendChild(row);
        });
        
        updateCartTotals();
    }
}

function setupCartInteractions() {
    // Quantity controls
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const productId = e.target.getAttribute('data-id');
            const isPlus = e.target.classList.contains('plus');
            updateCartQuantity(productId, isPlus);
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const target = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const productId = target.getAttribute('data-id');
            removeFromCart(productId);
        }
    });
    
    // Quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.getAttribute('data-id');
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                updateCartQuantity(productId, null, newQuantity);
            }
        }
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your order! This is a demo site, so no actual purchase will be made.');
            // In a real application, you would redirect to a checkout page
        });
    }
}

function updateCartQuantity(productId, isPlus, newQuantity = null) {
    const item = cart.find(item => item.id == productId);
    if (!item) return;
    
    if (newQuantity !== null) {
        item.quantity = newQuantity;
    } else if (isPlus) {
        item.quantity += 1;
    } else {
        item.quantity -= 1;
        if (item.quantity < 1) item.quantity = 1;
    }
    
    // Save to localStorage
    localStorage.setItem('majikBloomCart', JSON.stringify(cart));
    
    // Update display
    renderCartItems();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    
    // Save to localStorage
    localStorage.setItem('majikBloomCart', JSON.stringify(cart));
    
    // Update display
    renderCartItems();
    updateCartCount();
    
    showNotification('Item removed from cart');
}

function updateCartTotals() {
    const subtotalElement = document.querySelector('.summary-subtotal .summary-value');
    const taxElement = document.querySelector('.summary-tax .summary-value');
    const totalElement = document.querySelector('.summary-total .summary-value');
    
    if (subtotalElement && taxElement && totalElement) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax for example
        const total = subtotal + tax;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, var(--primary-purple), var(--light-purple));
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Product Gallery
function initializeProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                const newImageSrc = this.querySelector('img').src;
                mainImage.src = newImageSrc;
            });
        });
    }
}

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all tabs and tab contents
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}

// Form Validation
function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, you would send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

