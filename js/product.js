// Product Page JavaScript

// Product Data
let productData = null;
let selectedColor = 'Mango Yellow'; // Default to yellow
let currentQuantity = 1;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make sure logo links to home page
    setupNavigation();

    // Load product data
    loadProductData().then(() => {
        // Initialize product viewer
        initModelViewer();

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

// Setup logo navigation
function setupNavigation() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
}

// Initialize the model viewer with clean approach
function initModelViewer() {
    const modelViewer = document.getElementById('product-model-viewer');
    const arButton = document.getElementById('ar-button');
    const fallbackImage = document.getElementById('fallback-image');

    if (!modelViewer) return;

    // Get position parameters that can be tweaked
    const params = getModelParams();

    // Set up the progress indicator
    setupProgressBar(modelViewer);

    // Handle model loading events
    modelViewer.addEventListener('load', () => {
        console.log('Model loaded successfully');

        // Position the model using the tweakable parameters
        positionModel(modelViewer, params);

        // Mark as loaded
        modelViewer.classList.add('loaded');
    });

    // Handle load errors
    modelViewer.addEventListener('error', () => {
        console.error('Failed to load model');
        if (fallbackImage) {
            fallbackImage.style.display = 'block';
        }
    });

    // Setup custom AR button
    if (arButton) {
        arButton.addEventListener('click', () => {
            if (modelViewer.canActivateAR) {
                console.log('Activating AR');
                modelViewer.setAttribute('ar-scale', '0.00005');
                try {
                    modelViewer.activateAR();
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

// Get the model positioning parameters from the HTML
function getModelParams() {
    const paramsElement = document.getElementById('model-params');
    if (!paramsElement) {
        return { scale: 0.4, moveBack: 0, moveUp: 0.2 };
    }

    return {
        scale: parseFloat(paramsElement.getAttribute('data-scale') || 0.4),
        moveBack: parseFloat(paramsElement.getAttribute('data-move-back') || 0),
        moveUp: parseFloat(paramsElement.getAttribute('data-move-up') || 0.2)
    };
}

// Position the model using the parameters
function positionModel(modelViewer, params) {
    console.log(`Applying model position: scale=${params.scale}, moveUp=${params.moveUp}, moveBack=${params.moveBack}`);

    // Apply scale directly via attribute and property
    modelViewer.setAttribute('scale', `${params.scale} ${params.scale} ${params.scale}`);
    modelViewer.scale = `${params.scale} ${params.scale} ${params.scale}`;

    // Set rotation to face forward
    modelViewer.orientation = "0deg 180deg 0deg";

    // Apply translation (moving back and up)
    if (params.moveUp !== 0 || params.moveBack !== 0) {
        try {
            // Method 1: Apply CSS custom properties for translation
            modelViewer.style.setProperty('--model-translate-y', `${params.moveUp}m`);
            modelViewer.style.setProperty('--model-translate-z', `${params.moveBack}m`);

            // Method 2: Try direct manipulation of model position if available
            setTimeout(() => {
                if (modelViewer.model) {
                    try {
                        console.log("Setting direct model position");
                        // Directly modify model position
                        modelViewer.model.position.set(0, params.moveUp, params.moveBack);
                    } catch (err) {
                        console.warn('Could not set model position directly:', err);
                    }
                }
            }, 100); // Slight delay to ensure model is available
        } catch (e) {
            console.warn('Could not apply translation', e);
        }
    }

    // Debug log
    console.log('Model position applied with scale:', params.scale);
}

// Set up progress bar for model loading
function setupProgressBar(modelViewer) {
    modelViewer.addEventListener('progress', (event) => {
        const progressBar = modelViewer.querySelector('.progress-bar');
        const updatingBar = modelViewer.querySelector('.update-bar');

        if (!progressBar || !updatingBar) return;

        const progress = event.detail.totalProgress * 100;
        updatingBar.style.width = `${progress}%`;

        if (progress === 100) {
            progressBar.classList.add('hide');
        } else {
            progressBar.classList.remove('hide');
        }
    });
}

// Update model to selected color by changing material color
function updateModelColor(colorName) {
    const modelViewer = document.getElementById('product-model-viewer');
    if (!modelViewer || !productData) return;

    // Find color info
    const colorInfo = productData.colors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    if (!colorInfo) return;

    console.log(`Updating model to color: ${colorName}`);

    // Store the selected color info globally for cart access
    window.selectedColorInfo = colorInfo;

    // Color mapping for different MeSnap colors
    const colorMap = {
        'mango yellow': '#FFEB3B',
        'matcha green': '#4CAF50', 
        'strawberry pink': '#FFC0CB',
        'eco grey': '#c4bfbf',
        'white': '#FFFFFF',
        'black': '#000000'
    };

    const colorHex = colorMap[colorName.toLowerCase()] || '#FFEB3B';

    // Function to change model color
    function changeModelColor() {
        if (modelViewer.model && modelViewer.model.materials.length > 0) {
            const [material] = modelViewer.model.materials;
            if (material && material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.setBaseColorFactor(colorHex);
                console.log(`Applied color ${colorHex} to model for ${colorName}`);
            }
        }
    }

    // If model is already loaded, change color immediately
    if (modelViewer.model) {
        changeModelColor();
    } else {
        // Wait for model to load before accessing materials
        modelViewer.addEventListener('load', () => {
            setTimeout(changeModelColor, 100); // Small delay to ensure materials are ready
        }, { once: true });
    }
}

// Get default color from product data
function getDefaultColor() {
    if (!productData || !productData.colors) return 'Mango Yellow';

    const defaultColor = productData.colors.find(c => c.default);
    return defaultColor ? defaultColor.name : 'Mango Yellow';
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

            // Update price display with color-specific price
            updatePriceDisplay();
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

        // Get the selected color info for price_id and color-specific price
        const colorInfo = window.selectedColorInfo ||
            productData.colors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());

        // Create color-specific image path for the cart
        const colorFileName = selectedColor.toLowerCase().replace(/\s+/g, '_');
        const colorImage = `../images/shopping_cart_images/${colorFileName}.png`;

        const product = {
            id: productData.id,
            name: productData.name,
            color: selectedColor,
            quantity: currentQuantity,
            price: colorInfo ? colorInfo.price : productData.price, // Use color-specific price if available
            currency: productData.currency,
            image: colorImage, // Use color-specific image
            price_id: colorInfo ? colorInfo.price_id : null // Include price_id for Stripe
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

        // Get the selected color info for price_id and color-specific price
        const colorInfo = window.selectedColorInfo ||
            productData.colors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());

        // Create color-specific image path for the cart
        const colorFileName = selectedColor.toLowerCase().replace(/\s+/g, '_');
        const colorImage = `../images/shopping_cart_images/${colorFileName}.png`;

        const product = {
            id: productData.id,
            name: productData.name,
            color: selectedColor,
            quantity: currentQuantity,
            price: colorInfo ? colorInfo.price : productData.price, // Use color-specific price if available
            currency: productData.currency,
            image: colorImage, // Use color-specific image
            price_id: colorInfo ? colorInfo.price_id : null // Include price_id for Stripe
        };

        // Add to cart
        window.MeSnap.addToCart(product);

        // Redirect to cart page
        window.location.href = '/cart';
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
            if (currentPrice) currentPrice.textContent = '£14.95';

            return null;
        });
}

// Update price display based on product data and selected color
function updatePriceDisplay() {
    if (!productData) return;

    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    const discountBadge = document.getElementById('discount-badge');

    // Get the selected color info to display its specific price
    const colorInfo = window.selectedColorInfo ||
        productData.colors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase());

    // Get the appropriate price (color-specific or default product price)
    const priceToDisplay = colorInfo && colorInfo.price ? colorInfo.price : productData.price;

    if (currentPrice) {
        currentPrice.textContent = window.MeSnap.formatCurrency(priceToDisplay, productData.currency);
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
                        image: accessory.image,
                        price_id: accessory.price_id // Include price_id for Stripe
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