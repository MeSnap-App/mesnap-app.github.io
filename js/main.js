// Main JavaScript file for MeSnap.App

document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    setupMobileNav();

    // Initialize cart from localStorage
    initializeCart();

    // Modal functionality
    setupModals();
});

// Mobile Navigation
function setupMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }
}

// Cart Functionality
function initializeCart() {
    updateCartCount();
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const cartItems = getCartItems();

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = itemCount;
    });
}

function getCartItems() {
    const cart = localStorage.getItem('mesnap_cart');
    return cart ? JSON.parse(cart) : [];
}

function addToCart(product) {
    let cart = getCartItems();

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item =>
        item.id === product.id && item.color === product.color
    );

    if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart[existingItemIndex].quantity += product.quantity;
    } else {
        // Add new item to cart
        cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem('mesnap_cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    return cart;
}

function removeFromCart(index) {
    let cart = getCartItems();

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);

        // Save to localStorage
        localStorage.setItem('mesnap_cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();
    }

    return cart;
}

function clearCart() {
    localStorage.removeItem('mesnap_cart');
    updateCartCount();
}

// Modal Functionality
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal, .close-success');

    // Close modal when clicking close button
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Product Data Handler
function getProductData() {
    return fetch('../data/products.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error loading product data:', error);
            return {
                products: [
                    {
                        id: 'mesnap-001',
                        name: 'MeSnap ID Card Holder',
                        price: 19.99,
                        currency: 'GBP',
                        colors: [
                            { name: 'Green', hex: '#4CAF50', stock: 25 },
                            { name: 'Blue', hex: '#2196F3', stock: 30 },
                            { name: 'Yellow', hex: '#FFEB3B', stock: 20, default: true },
                            { name: 'Pastel Pink', hex: '#FFC0CB', stock: 15 },
                            { name: 'White', hex: '#FFFFFF', stock: 35 },
                            { name: 'Black', hex: '#000000', stock: 40 },
                            { name: 'Red', hex: '#F44336', stock: 18 }
                        ],
                        images: {
                            solo: 'images/product-solo.png',
                            phone: 'images/product-phone.png',
                            lanyard: 'images/product-lanyard.png'
                        }
                    }
                ],
                accessories: [
                    {
                        id: 'accessory-001',
                        name: 'Premium Lanyard',
                        price: 9.99,
                        currency: 'GBP',
                        image: 'images/accessory-lanyard.png'
                    },
                    {
                        id: 'accessory-002',
                        name: 'MagSafe Charger',
                        price: 29.99,
                        currency: 'GBP',
                        image: 'images/accessory-charger.png'
                    },
                    {
                        id: 'accessory-003',
                        name: 'Student Bundle',
                        price: 39.99,
                        currency: 'GBP',
                        image: 'images/accessory-bundle.png'
                    }
                ]
            };
        });
}

// Utility Functions
function formatCurrency(amount, currency = 'GBP') {
    const currencySymbols = {
        'USD': '$',
        'GBP': '£',
        'EUR': '€'
    };

    const symbol = currencySymbols[currency] || currencySymbols['GBP'];
    return symbol + amount.toFixed(2);
}

// Check if an item has discount
function hasDiscount(item) {
    return item.discount && item.originalPrice && item.price < item.originalPrice;
}

// Get discount display info
function getDiscountInfo(item) {
    if (!hasDiscount(item)) return null;

    return {
        originalPrice: formatCurrency(item.originalPrice, item.currency),
        discountPercentage: item.discount,
        discountLabel: item.discountLabel || `${item.discount}% Off`
    };
}

// Export functions for use in other scripts
window.MeSnap = {
    getCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartCount,
    openModal,
    getProductData,
    formatCurrency,
    hasDiscount,
    getDiscountInfo
};