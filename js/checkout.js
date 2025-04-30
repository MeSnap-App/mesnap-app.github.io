// Stripe Checkout Integration

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            // Check if cart is empty
            const cartItems = window.MeSnap.getCartItems();
            if (cartItems.length === 0) {
                alert('Your cart is empty');
                return;
            }

            // Check if all items have price_id
            const missingPriceIds = cartItems.filter(item => !item.price_id);
            if (missingPriceIds.length > 0) {
                alert('Some items in your cart are not available for purchase at this time.');
                return;
            }

            // Prepare items for Stripe
            const items = cartItems.map(item => ({
                id: item.price_id,
                quantity: item.quantity
            }));

            // Show loading state
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Processing...';

            try {
                // Get the backend URL from configuration or environment
                const BACKEND_URL = window.MESNAP_CONFIG?.STRIPE_BACKEND_URL || 'https://mesnap-stripe.up.railway.app';
                console.log("Using backend URL:", BACKEND_URL);
                console.log("Cart items being sent:", items);
                
                // Send request to create checkout session
                console.log("Sending request to:", `${BACKEND_URL}/create-checkout-session`);
                const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ items })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Server response error:", response.status, errorText);
                    throw new Error(`Error: ${response.status} - ${errorText}`);
                }

                const { clientSecret } = await response.json();
                
                // Store the client secret in session storage
                sessionStorage.setItem('checkoutClientSecret', clientSecret);
                
                // Redirect to the checkout page
                window.location.href = 'stripe-checkout.html';
                
            } catch (error) {
                console.error('Error creating checkout session:', error);
                alert('There was a problem with the checkout process. Please try again.');
                
                // Reset button state
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Checkout';
            }
        });
    }
});