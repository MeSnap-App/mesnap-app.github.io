// Initialize Stripe Checkout with embedded UI
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get Stripe public key from config
        const stripePublicKey = window.MESNAP_CONFIG?.STRIPE_PUBLIC_KEY || 
            'pk_live_51RJ0KLAIKeA0MU3RgU9KOf6vdPzuO0ONLTFGeysa4RkdfzRZzd7orAQSgLzHEyLG0M69x3PcCNpJ674buI4SlL9H00YFacEAoo';
        
        // Initialize Stripe
        const stripe = Stripe(stripePublicKey);
        
        // Get the client secret from session storage
        const storedClientSecret = sessionStorage.getItem('checkoutClientSecret');
        
        if (!storedClientSecret) {
            console.error('No client secret found in session storage');
            window.location.href = 'cart.html';
            return;
        }
        
        // Fetch client secret function
        const fetchClientSecret = async () => {
            return storedClientSecret;
        };
        
        // Initialize embedded checkout
        const checkout = await stripe.initEmbeddedCheckout({
            fetchClientSecret,
        });
        
        // Mount checkout to the DOM
        checkout.mount('#checkout');
        
        // Clear session storage after mounting
        sessionStorage.removeItem('checkoutClientSecret');
        
        // Update cart count
        window.MeSnap.updateCartCount();
        
    } catch (error) {
        console.error('Error initializing Stripe checkout:', error);
        document.getElementById('checkout').innerHTML = `
            <div class="error-message">
                <p>There was a problem loading the payment form. Please try again.</p>
                <a href="cart.html" class="btn primary-btn">Return to Cart</a>
            </div>
        `;
    }
});