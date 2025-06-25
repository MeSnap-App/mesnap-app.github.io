// Initialize Stripe Checkout with embedded UI
document.addEventListener('DOMContentLoaded', async () => {
    // Get elements
    const checkoutElement = document.getElementById('checkout');
    const loadingIndicator = document.getElementById('loading-indicator');

    try {
        console.log('Initializing Stripe checkout...');

        // Get Stripe public key from config
        const stripePublicKey = window.MESNAP_CONFIG?.STRIPE_PUBLIC_KEY ||
            'pk_live_51RJ0KLAIKeA0MU3RgU9KOf6vdPzuO0ONLTFGeysa4RkdfzRZzd7orAQSgLzHEyLG0M69x3PcCNpJ674buI4SlL9H00YFacEAoo';
        console.log('Using Stripe public key:', stripePublicKey);

        // Get the client secret from session storage
        const clientSecret = sessionStorage.getItem('checkoutClientSecret');
        console.log('Client secret exists:', !!clientSecret);

        if (!clientSecret) {
            console.error('No client secret found in session storage');
            // Show error in the wrapper element
            loadingIndicator.style.display = 'none';
            document.getElementById('checkout-wrapper').innerHTML = `
                <div class="error-message">
                    <p>No checkout session found. Please return to cart and try again.</p>
                    <a href="/cart" class="btn primary-btn">Return to Cart</a>
                </div>
            `;
            return;
        }

        // Initialize Stripe
        console.log('Initializing Stripe...');
        const stripe = Stripe(stripePublicKey);

        try {
            // Initialize embedded checkout with client secret
            console.log('Client secret (first 10 chars):', clientSecret.substring(0, 10) + '...');
            const checkout = await stripe.initEmbeddedCheckout({
                clientSecret,
            });

            // Prepare the checkout container - make sure it's empty and visible
            console.log('Preparing checkout container...');
            checkoutElement.innerHTML = ''; // Ensure it's empty
            checkoutElement.style.display = 'block'; // Make it visible

            // Hide loading indicator
            loadingIndicator.style.display = 'none';

            console.log('Mounting checkout to DOM...');
            // Mount checkout to the DOM
            checkout.mount('#checkout');

            // Clear session storage after mounting (only if successful)
            console.log('Checkout mounted successfully');
            sessionStorage.removeItem('checkoutClientSecret');

        } catch (checkoutError) {
            console.error('Stripe checkout initialization error:', checkoutError);
            throw checkoutError;
        }

    } catch (error) {
        console.error('Error initializing Stripe checkout:', error);
        let errorMessage = 'There was a problem loading the payment form.';

        // More detailed error message
        if (error.message) {
            if (error.message.includes('API key')) {
                errorMessage = 'There was a problem with the Stripe configuration.';
            } else if (error.message.includes('client_secret')) {
                errorMessage = 'Invalid checkout session.';
            }

            console.error('Error details:', error.message);
        }

        // Hide loading indicator and show error
        loadingIndicator.style.display = 'none';
        document.getElementById('checkout-wrapper').innerHTML = `
            <div class="error-message">
                <p>${errorMessage} Please try again.</p>
                <p class="error-details">${error.message || ''}</p>
                <a href="/cart" class="btn primary-btn">Return to Cart</a>
            </div>
        `;
    }
});