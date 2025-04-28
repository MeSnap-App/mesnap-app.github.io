// Product Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Load product data first
    loadProductData().then(() => {
        // Initialize product viewer (model-viewer)
        initProductViewer();

        // Initialize color selection
        initColorSelection();

        // Initialize quantity controls
        initQuantityControls();

        // Add to cart button
        initAddToCart();

        // Buy now button
        initBuyNow();

        // Initialize related products
        initRelatedProducts();
    });
});

// Product Data
let productData = null;
let selectedColor = 'Yellow'; // Default to yellow
let currentQuantity = 1;

// Product Viewer using model-viewer
function initProductViewer() {
    const modelViewer = document.getElementById('product-model-viewer');
    const arButton = document.getElementById('ar-button');
    const fallbackImage = document.getElementById('fallback-image');

    if (!modelViewer) return;

    // Add progress handler
    const onProgress = (event) => {
        const progressBar = event.target.querySelector('.progress-bar');
        const updatingBar = event.target.querySelector('.update-bar');

        if (!progressBar || !updatingBar) return;

        updatingBar.style.width = `${event.detail.totalProgress * 100}%`;

        if (event.detail.totalProgress === 1) {
            progressBar.classList.add('hide');
        } else {
            progressBar.classList.remove('hide');
        }
    };

    // Listen for loading events
    modelViewer.addEventListener('progress', onProgress);

    // Listen for load failure
    modelViewer.addEventListener('error', () => {
        console.error('Failed to load model');
        if (fallbackImage) {
            fallbackImage.style.display = 'block';
        }
    });

    // Handle model loaded successfully
    modelViewer.addEventListener('load', () => {
        console.log('Model loaded successfully');

        // Mark as loaded to show the model
        modelViewer.classList.add('loaded');

        // Store loaded status for later checks
        modelViewer.loaded = true;

        // Make sure scale and orientation are applied correctly on first load
        modelViewer.scale = "0.4 0.4 0.4";
        modelViewer.orientation = "0deg 180deg 00deg";

        // Set camera to a good viewing distance
        modelViewer.cameraOrbit = "180deg 75deg 3.5m";
        modelViewer.fieldOfView = "40deg";

        console.log('Applied initial positioning and scaling');

        // Force a redraw to ensure model is visible
        setTimeout(() => {
            const currentOpacity = window.getComputedStyle(modelViewer).opacity;
            modelViewer.style.opacity = '0.99';
            setTimeout(() => {
                modelViewer.style.opacity = currentOpacity;
            }, 15);
        }, 100);
    });

    // Initial model is set directly in the HTML (mesnap_yellow.glb)
    // We'll replace it when the color selection changes

    // Setup custom AR button
    if (arButton) {
        arButton.addEventListener('click', () => {
            if (modelViewer.canActivateAR) {
                console.log('Activating AR experience');

                // Ensure AR scale is very small (to fix the 1000x too large issue)
                // This needs to be set right before activating AR
                modelViewer.setAttribute('ar-scale', '0.0001');
                modelViewer.setAttribute('ar-placement', 'floor');

                try {
                    // Activate AR
                    modelViewer.activateAR();
                    console.log('AR experience activated');
                } catch (error) {
                    console.error('Error activating AR:', error);
                    alert('AR mode is not supported on your device');
                }
            } else {
                console.warn('AR not supported on this device/browser');
                alert('AR is not supported in your browser or device');
            }
        });
    }
}

// Update model color by loading the correct GLB file for each color
function updateModelColor(colorName) {
    const modelViewer = document.getElementById('product-model-viewer');
    if (!modelViewer || !productData) return;

    // Find color info
    const colorInfo = productData.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    if (!colorInfo) return;

    console.log(`Updating model to color: ${colorName}`);

    // Convert color name to file name format (lowercase and replace spaces with underscores)
    const colorFileName = colorName.toLowerCase().replace(/\s+/g, '_');

    // Construct the file path for the specific color model
    const modelPath = `models/mesnap_${colorFileName}.glb`;

    // Remember current camera position and rotation
    const currentOrbit = modelViewer.getCameraOrbit();
    const currentZoom = modelViewer.getFieldOfView();

    // Ensure we keep current scale and orientation settings
    const currentScale = "0.4 0.4 0.4";  // Keep consistent with HTML attributes
    const currentOrientation = "0deg 180deg 0deg";  // Keep consistent with HTML attributes

    // Update the model path
    modelViewer.src = modelPath;

    // After the model is loaded, restore camera position and rotation and ensure proper scale/orientation
    modelViewer.addEventListener('load', () => {
        // Re-apply camera settings
        modelViewer.cameraOrbit = currentOrbit;
        modelViewer.fieldOfView = currentZoom;

        // Ensure proper scale and orientation
        modelViewer.scale = currentScale;
        modelViewer.orientation = currentOrientation;

        // Mark as loaded
        modelViewer.classList.add('loaded');

        console.log(`Loaded model for ${colorName}`);
    }, { once: true });

    modelViewer.addEventListener('error', () => {
        console.error(`Failed to load model for color: ${colorName}`);
        // If specific color model fails, fallback to yellow
        if (colorFileName !== 'yellow') {
            console.log('Falling back to default yellow model');
            modelViewer.src = 'models/mesnap_yellow.glb';
        }
    }, { once: true });
}

// Get default color from product data
function getDefaultColor() {
    if (!productData || !productData.colors) return 'Yellow';

    const defaultColor = productData.colors.find(c => c.default);
    return defaultColor ? defaultColor.name : 'Yellow';
}

// Color Selection
function initColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorText = document.querySelector('#selected-color span');

    // Find the default color from product data
    const defaultColorName = getDefaultColor();

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));

            // Add selected class to clicked option
            option.classList.add('selected');

            // Get color name
            const colorName = option.querySelector('.color-name').textContent;

            // Update selected color display
            if (selectedColorText) {
                selectedColorText.textContent = colorName;
            }

            // Update selected color state
            selectedColor = colorName;

            // Update 3D model color
            updateModelColor(colorName);

            // Update stock status
            updateStockStatus();
        });
    });

    // Set default selection
    const defaultOption = document.querySelector(`.color-option[data-color="${defaultColorName.toLowerCase()}"]`);
    if (defaultOption) {
        defaultOption.classList.add('selected');
        selectedColor = defaultColorName;

        if (selectedColorText) {
            selectedColorText.textContent = defaultColorName;
        }
    }
}

// Quantity Controls
function initQuantityControls() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity');

    if (!decreaseBtn || !increaseBtn || !quantityInput) return;

    // Update quantity function
    function updateQuantity(value) {
        const min = parseInt(quantityInput.min) || 1;
        const max = parseInt(quantityInput.max) || 10;

        // Ensure value is within limits
        value = Math.max(min, Math.min(max, value));

        // Update input value
        quantityInput.value = value;
        currentQuantity = value;

        // Update button states
        decreaseBtn.disabled = value <= min;
        increaseBtn.disabled = value >= max;
    }

    // Event listeners
    decreaseBtn.addEventListener('click', () => {
        updateQuantity(parseInt(quantityInput.value) - 1);
    });

    increaseBtn.addEventListener('click', () => {
        updateQuantity(parseInt(quantityInput.value) + 1);
    });

    quantityInput.addEventListener('change', () => {
        updateQuantity(parseInt(quantityInput.value));
    });

    // Initialize
    updateQuantity(1);
}

// Add to Cart
function initAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart');

    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', () => {
        if (!productData) return;

        const product = {
            id: productData.id,
            name: productData.name,
            color: selectedColor,
            quantity: currentQuantity,
            price: productData.price,
            currency: productData.currency,
            image: productData.images.solo
        };

        // Add to cart
        window.MeSnap.addToCart(product);

        // Show confirmation
        showConfirmation('Added to cart!');
    });
}

// Buy Now
function initBuyNow() {
    const buyNowBtn = document.getElementById('buy-now');

    if (!buyNowBtn) return;

    buyNowBtn.addEventListener('click', () => {
        if (!productData) return;

        const product = {
            id: productData.id,
            name: productData.name,
            color: selectedColor,
            quantity: currentQuantity,
            price: productData.price,
            currency: productData.currency,
            image: productData.images.solo
        };

        // Add to cart
        window.MeSnap.addToCart(product);

        // Redirect to cart page
        window.location.href = 'cart.html';
    });
}

// Load Product Data
function loadProductData() {
    // Update price display with loading state
    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    const discountBadge = document.getElementById('discount-badge');

    if (currentPrice) currentPrice.textContent = 'Loading...';
    if (originalPrice) originalPrice.style.display = 'none';
    if (discountBadge) discountBadge.style.display = 'none';

    return window.MeSnap.getProductData()
        .then(data => {
            productData = data.products[0];

            // Update price display
            updatePriceDisplay();

            // Update stock status
            updateStockStatus();

            return productData;
        })
        .catch(error => {
            console.error('Error loading product data:', error);

            // Show a fallback price
            if (currentPrice) currentPrice.textContent = '£19.99';

            return null;
        });
}

// Update price display based on product data
function updatePriceDisplay() {
    if (!productData) return;

    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    const discountBadge = document.getElementById('discount-badge');

    if (currentPrice) {
        currentPrice.textContent = window.MeSnap.formatCurrency(productData.price, productData.currency);
    }

    // Check if there's a discount
    if (window.MeSnap.hasDiscount(productData)) {
        const discountInfo = window.MeSnap.getDiscountInfo(productData);

        if (originalPrice) {
            originalPrice.textContent = discountInfo.originalPrice;
            originalPrice.style.display = 'inline';
        }

        if (discountBadge) {
            discountBadge.textContent = discountInfo.discountLabel;
            discountBadge.style.display = 'block';
        }
    } else {
        if (originalPrice) originalPrice.style.display = 'none';
        if (discountBadge) discountBadge.style.display = 'none';
    }
}

// Update Stock Status
function updateStockStatus() {
    if (!productData) return;

    const stockStatus = document.getElementById('stock-status');
    if (!stockStatus) return;

    const colorInfo = productData.colors.find(c => c.name === selectedColor);

    if (colorInfo) {
        const stock = colorInfo.stock;

        if (stock > 10) {
            stockStatus.textContent = 'In Stock';
            stockStatus.style.color = 'var(--success)';
        } else if (stock > 0) {
            stockStatus.textContent = `Only ${stock} left in stock`;
            stockStatus.style.color = 'var(--warning)';
        } else {
            stockStatus.textContent = 'Out of Stock';
            stockStatus.style.color = 'var(--error)';
        }

        // Update max quantity
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.max = Math.min(10, stock);

            if (currentQuantity > stock) {
                currentQuantity = stock > 0 ? stock : 1;
                quantityInput.value = currentQuantity;
            }
        }
    }
}

// Initialize Related Products
function initRelatedProducts() {
    if (!productData) return;

    const container = document.getElementById('related-products-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Get accessories from product data
    const accessories = window.MeSnap.getProductData()
        .then(data => {
            if (!data || !data.accessories) return;

            data.accessories.forEach(accessory => {
                const hasDiscount = window.MeSnap.hasDiscount(accessory);
                const discountInfo = hasDiscount ? window.MeSnap.getDiscountInfo(accessory) : null;

                const item = document.createElement('div');
                item.className = 'related-item';

                item.innerHTML = `
                    ${hasDiscount ? `<div class="related-discount">${discountInfo.discountLabel}</div>` : ''}
                    <img src="${accessory.image}" alt="${accessory.name}">
                    <h3>${accessory.name}</h3>
                    <div class="related-price-container">
                        ${hasDiscount ? `<span class="related-original-price">${discountInfo.originalPrice}</span>` : ''}
                        <span class="related-price">${window.MeSnap.formatCurrency(accessory.price, accessory.currency)}</span>
                    </div>
                    <button class="btn outline-btn" data-id="${accessory.id}">Add to Cart</button>
                `;

                // Add event listener to the add to cart button
                const addButton = item.querySelector('.btn');
                addButton.addEventListener('click', () => {
                    const accessoryToAdd = {
                        id: accessory.id,
                        name: accessory.name,
                        quantity: 1,
                        price: accessory.price,
                        currency: accessory.currency,
                        image: accessory.image
                    };

                    window.MeSnap.addToCart(accessoryToAdd);
                    showConfirmation('Added to cart!');
                });

                container.appendChild(item);
            });
        });
}

// Confirmation Message
function showConfirmation(message) {
    // Create or update confirmation message
    let confirmation = document.querySelector('.confirmation-message');

    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.className = 'confirmation-message';
        document.body.appendChild(confirmation);
    }

    // Set message
    confirmation.textContent = message;
    confirmation.classList.add('active');

    // Hide after a delay
    setTimeout(() => {
        confirmation.classList.remove('active');
    }, 3000);
}