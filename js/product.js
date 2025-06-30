// Product Page JavaScript

// Supabase Configuration
const SUPABASE_URL = 'https://xbqrmfsezvyxfdhfgele.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicXJtZnNlenZ5eGZkaGZnZWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDMyOTcsImV4cCI6MjA2NjgxOTI5N30.IKJj9b-jM6SNwZ2VB21Ur92LsEwOFvyJ_IiXhIeAmbM';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Product Data
let productData = [];
let selectedProduct = null;
let selectedColor = 'Mango Yellow'; // Default to yellow
let currentQuantity = 1;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make sure logo links to home page
    setupNavigation();

    // Initialize model viewer immediately (independent of database)
    initModelViewer();

    // Load product data
    loadProductData().then((data) => {
        if (data) {
            // Initialize color selection
            initColorSelection();

            // Apply initial color to model after everything is set up
            setTimeout(() => {
                if (selectedProduct) {
                    updateModelColor(selectedProduct.colour_name);
                }
            }, 100);

            // Initialize quantity controls
            initQuantityControls();

            // Add to cart button
            initAddToCart();

            // Buy now button
            initBuyNow();

            // Initialize related products
            initRelatedProducts();
        } else {
            console.error('Failed to load product data - using fallback mode');
            // Initialize basic functionality without database
            initQuantityControls();
            // Show fallback price
            const currentPrice = document.getElementById('current-price');
            if (currentPrice) currentPrice.textContent = '£14.95';
        }
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

        // Apply initial material properties (color, metalness 0.5, roughness 0.7)
        setTimeout(() => {
            if (modelViewer.model && modelViewer.model.materials.length > 0) {
                const [material] = modelViewer.model.materials;
                if (material && material.pbrMetallicRoughness) {
                    material.pbrMetallicRoughness.setBaseColorFactor('#FFEB3B');
                    material.pbrMetallicRoughness.setMetallicFactor(0.7);
                    material.pbrMetallicRoughness.setRoughnessFactor(0.5);
                    console.log('Applied initial color #FFEB3B, metalness 0.7, roughness 0.5 to model');
                }
            }
        }, 10);

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
            }, 10); // Slight delay to ensure model is available
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

// Update model to selected color by changing material color using Supabase data
function updateModelColor(colorName) {
    const modelViewer = document.getElementById('product-model-viewer');
    if (!modelViewer || !productData) return;

    // Find product info from Supabase data
    const product = productData.find(p => p.colour_name.toLowerCase() === colorName.toLowerCase());
    if (!product) return;

    console.log(`Updating model to color: ${colorName}`);

    // Store the selected product globally for cart access
    window.selectedProductInfo = product;
    selectedProduct = product;

    // Get color hex from database (3d_model_hex for the actual 3D model color)
    const colorHex = `#${product['3d_model_hex']}`;
    const metalness = product['3d_model_metalness'] || 0.7;
    const roughness = product['3d_model_roughness'] || 0.5;

    // Function to change model color
    function changeModelColor() {
        if (modelViewer.model && modelViewer.model.materials.length > 0) {
            const [material] = modelViewer.model.materials;
            if (material && material.pbrMetallicRoughness) {
                material.pbrMetallicRoughness.setBaseColorFactor(colorHex);
                material.pbrMetallicRoughness.setMetallicFactor(metalness);
                material.pbrMetallicRoughness.setRoughnessFactor(roughness);
                console.log(`Applied color ${colorHex}, metalness ${metalness}, roughness ${roughness} to model for ${colorName}`);
            }
        }
    }

    // If model is already loaded, change color immediately
    if (modelViewer.model) {
        changeModelColor();
    } else {
        // Wait for model to load before accessing materials
        modelViewer.addEventListener('load', () => {
            setTimeout(changeModelColor, 10); // Small delay to ensure materials are ready
        }, { once: true });
    }
}

// Get default color from product data (first product in array)
function getDefaultColor() {
    if (!productData || productData.length === 0) return 'Mango Yellow';

    return productData[0].colour_name;
}

// Color Selection - Now dynamically generated from Supabase data
function initColorSelection() {
    if (!productData || productData.length === 0) return;

    const colorOptionsContainer = document.querySelector('.color-options');
    const selectedColorText = document.querySelector('#selected-color span');

    if (!colorOptionsContainer) return;

    // Clear existing color options
    colorOptionsContainer.innerHTML = '';

    // Generate color options from database
    productData.forEach(product => {
        const colorOption = document.createElement('button');
        colorOption.className = 'color-option';
        colorOption.setAttribute('data-color', product.colour_name.toLowerCase().replace(/\s+/g, '_'));
        colorOption.style.backgroundColor = `#${product.colour_hex}`;

        // Add border for white color for visibility
        if (product.colour_hex.toLowerCase() === 'ffffff') {
            colorOption.style.border = '1px solid #ddd';
        }

        const colorName = document.createElement('span');
        colorName.className = 'color-name';
        colorName.textContent = product.colour_name;
        colorOption.appendChild(colorName);

        // Add click event listener
        colorOption.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));

            // Add selected class to clicked option
            colorOption.classList.add('selected');

            // Update selected color display
            if (selectedColorText) {
                selectedColorText.textContent = product.colour_name;
            }

            // Update selected color state and product
            selectedColor = product.colour_name;
            selectedProduct = product;

            // Update 3D model color
            updateModelColor(product.colour_name);

            // Update stock status
            updateStockStatus();

            // Update price display
            updatePriceDisplay();
        });

        colorOptionsContainer.appendChild(colorOption);
    });

    // Set default selection (first product or previously selected)
    if (selectedProduct) {
        const defaultOption = document.querySelector(`.color-option[data-color="${selectedProduct.colour_name.toLowerCase().replace(/\s+/g, '_')}"]`);
        if (defaultOption) {
            defaultOption.classList.add('selected');
            if (selectedColorText) {
                selectedColorText.textContent = selectedProduct.colour_name;
            }
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
        if (!selectedProduct) return;

        // Get image from Supabase data (assuming images field has cart image)
        let cartImage = '../images/product-solo.png'; // fallback
        if (selectedProduct.images && selectedProduct.images.cart) {
            cartImage = selectedProduct.images.cart;
        }

        const product = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            color: selectedProduct.colour_name,
            quantity: currentQuantity,
            price: selectedProduct.price,
            currency: selectedProduct.currency,
            image: cartImage,
            price_id: selectedProduct.stripe_price_id
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
        if (!selectedProduct) return;

        // Get image from Supabase data (assuming images field has cart image)
        let cartImage = '../images/product-solo.png'; // fallback
        if (selectedProduct.images && selectedProduct.images.cart) {
            cartImage = selectedProduct.images.cart;
        }

        const product = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            color: selectedProduct.colour_name,
            quantity: currentQuantity,
            price: selectedProduct.price,
            currency: selectedProduct.currency,
            image: cartImage,
            price_id: selectedProduct.stripe_price_id
        };

        // Add to cart
        window.MeSnap.addToCart(product);

        // Redirect to cart page
        window.location.href = '/cart';
    });
}

// Load Product Data from Supabase
async function loadProductData() {
    // Update price display with loading state
    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    const discountBadge = document.getElementById('discount-badge');

    if (currentPrice) currentPrice.textContent = 'Loading...';
    if (originalPrice) originalPrice.style.display = 'none';
    if (discountBadge) discountBadge.style.display = 'none';

    try {
        // Fetch products from Supabase
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error('No products found');
        }

        productData = data;

        // Set the first product as selected (or find default)
        selectedProduct = productData.find(p => p.colour_name.toLowerCase() === selectedColor.toLowerCase()) || productData[0];

        if (selectedProduct) {
            selectedColor = selectedProduct.colour_name;
            console.log('Selected product:', selectedProduct);
        }

        console.log('Loaded products from Supabase:', productData);

        // Update price display
        updatePriceDisplay();

        // Update stock status
        updateStockStatus();

        return productData;

    } catch (error) {
        console.error('Error loading product data from Supabase:', error);

        // Show a fallback price
        if (currentPrice) currentPrice.textContent = '£14.95';

        return null;
    }
}

// Update price display based on selected product from Supabase
function updatePriceDisplay() {
    if (!selectedProduct) return;

    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    const discountBadge = document.getElementById('discount-badge');

    if (currentPrice) {
        currentPrice.textContent = `${selectedProduct.currency}${selectedProduct.price.toFixed(2)}`;
    }

    // For now, hide discount elements (can be enhanced later with discount logic)
    if (originalPrice) originalPrice.style.display = 'none';
    if (discountBadge) discountBadge.style.display = 'none';
}

// Update Stock Status based on selected product from Supabase
function updateStockStatus() {
    if (!selectedProduct) return;

    const stockStatus = document.getElementById('stock-status');
    if (!stockStatus) return;

    const stock = selectedProduct.stock;

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