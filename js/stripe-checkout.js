// Stripe Checkout Integration

// Initialize Stripe
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Stripe checkout when checkout button is clicked
    initStripeCheckout();
});

// Initialize Stripe Checkout
function initStripeCheckout() {
    const checkoutButton = document.getElementById('place-order-btn');
    if (!checkoutButton) return;
    
    // Replace with your publishable key
    const stripePublicKey = 'pk_live_51RJ0KLAIKeA0MU3RgU9KOf6vdPzuO0ONLTFGeysa4RkdfzRZzd7orAQSgLzHEyLG0M69x3PcCNpJ674buI4SlL9H00YFacEAoo';
    const stripe = Stripe(stripePublicKey);
    
    checkoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Get cart items
        const cartItems = window.MeSnap.getCartItems();
        if (!cartItems.length) {
            alert('Your cart is empty');
            return;
        }
        
        // Format items for Stripe
        const lineItems = cartItems.map(item => {
            return {
                id: item.price_id, // Use the price_id we stored
                quantity: item.quantity
            };
        });
        
        try {
            // Create checkout session
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: lineItems
                }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${errorText}`);
            }
            
            const { clientSecret } = await response.json();
            
            // Store client secret in session storage
            sessionStorage.setItem('checkoutClientSecret', clientSecret);
            
            // Redirect to checkout page
            window.location.href = '/checkout.html';
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
            alert('There was a problem with the checkout process. Please try again.');
        }
    });
}

// Handle successful payment
function handleSuccessfulPayment() {
    // Clear cart
    window.MeSnap.clearCart();
    
    // Show success message
    window.MeSnap.openModal('success-modal');
}