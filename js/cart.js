// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Load cart items
    loadCartItems();

    // Initialize checkout button
    initCheckout();
});

// Load Cart Items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cart = window.MeSnap.getCartItems();

    // Clear previous items
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => {
        if (!item.classList.contains('empty-cart-message')) {
            item.remove();
        }
    });

    if (cart.length === 0) {
        // Show empty cart message
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }

        // Disable checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        // Clear summary
        updateOrderSummary({
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0
        });

        return;
    }

    // Hide empty cart message
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }

    // Enable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }

    // Add cart items
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });

    // Calculate and update order summary
    updateOrderSummary(calculateOrderSummary(cart));
}

// Create Cart Item Element
function createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;

    // Get color-specific image if applicable
    let itemImage = item.image;

    // Check if this is a MeSnap ID Card Holder with a color AND the image doesn't already point to a color image
    if (item.name.includes('MeSnap ID Card Holder') && item.color && !itemImage.includes('shopping_cart_images')) {
        // Convert color name to filename format (lowercase and underscores)
        const colorFileName = item.color.toLowerCase().replace(/\s+/g, '_');
        itemImage = `../images/shopping_cart_images/${colorFileName}.png`;
    }

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${itemImage}" alt="${item.name} (${item.color})">
        </div>
        <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-color">Color: <span>${item.color}</span></p>
            <div class="item-quantity">
                <button class="quantity-btn decrease-btn">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10">
                <button class="quantity-btn increase-btn">+</button>
            </div>
        </div>
        <div class="item-price">${window.MeSnap.formatCurrency(item.price * item.quantity)}</div>
        <button class="remove-item">✕</button>
    `;

    // Event listeners
    const decreaseBtn = cartItem.querySelector('.decrease-btn');
    const increaseBtn = cartItem.querySelector('.increase-btn');
    const quantityInput = cartItem.querySelector('input');
    const removeBtn = cartItem.querySelector('.remove-item');

    // Decrease quantity
    decreaseBtn.addEventListener('click', () => {
        updateItemQuantity(index, parseInt(quantityInput.value) - 1);
    });

    // Increase quantity
    increaseBtn.addEventListener('click', () => {
        updateItemQuantity(index, parseInt(quantityInput.value) + 1);
    });

    // Input change
    quantityInput.addEventListener('change', () => {
        updateItemQuantity(index, parseInt(quantityInput.value));
    });

    // Remove item
    removeBtn.addEventListener('click', () => {
        window.MeSnap.removeFromCart(index);
        loadCartItems(); // Reload cart display
    });

    return cartItem;
}

// Update Item Quantity
function updateItemQuantity(index, quantity) {
    const cart = window.MeSnap.getCartItems();

    if (index >= 0 && index < cart.length) {
        // Ensure quantity is between 1 and 10
        quantity = Math.max(1, Math.min(10, quantity));

        cart[index].quantity = quantity;

        // Save to localStorage
        localStorage.setItem('mesnap_cart', JSON.stringify(cart));

        // Update cart count
        window.MeSnap.updateCartCount();

        // Reload cart display
        loadCartItems();
    }
}

// Calculate Order Summary
function calculateOrderSummary(cart) {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Calculate shipping (free over $35, otherwise $5.99)
    const shipping = subtotal >= 35 ? 0 : 5.99;

    // Calculate tax (8.25%)
    const tax = subtotal * 0;

    // Calculate total
    const total = subtotal + shipping + tax;

    return {
        subtotal,
        shipping,
        tax,
        total
    };
}

// Update Order Summary
function updateOrderSummary(summary) {
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');

    if (subtotalElement) {
        subtotalElement.textContent = window.MeSnap.formatCurrency(summary.subtotal);
    }

    if (shippingElement) {
        shippingElement.textContent = summary.shipping === 0 ? 'FREE' : window.MeSnap.formatCurrency(summary.shipping);
    }

    if (taxElement) {
        taxElement.textContent = window.MeSnap.formatCurrency(summary.tax);
    }

    if (totalElement) {
        totalElement.textContent = window.MeSnap.formatCurrency(summary.total);
    }
}

// Initialize Checkout
function initCheckout() {
    // The checkout.js file now handles all checkout functionality
    // This function is kept for compatibility with the existing code
    // but we've removed the modal-based checkout
}