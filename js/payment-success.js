// Payment success page handler
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get session ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (!sessionId) {
            console.error('No session ID found in URL');
            return;
        }
        
        // Get the backend URL from configuration
        const BACKEND_URL = window.MESNAP_CONFIG?.STRIPE_BACKEND_URL || 
            'https://mesnap-stripe.up.railway.app';
        
        // Fetch session status from backend
        const response = await fetch(`${BACKEND_URL}/session-status?session_id=${sessionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch session status');
        }
        
        const session = await response.json();
        
        // Handle different session statuses
        if (session.status === 'complete') {
            // Update customer email in the page
            if (session.customer_email) {
                document.getElementById('customer-email').textContent = session.customer_email;
            }
            
            // Clear cart as payment is successful
            window.MeSnap.clearCart();
            
        } else {
            // If payment is not complete, redirect back to cart
            window.location.href = 'cart.html';
        }
        
    } catch (error) {
        console.error('Error processing payment success:', error);
    }
});