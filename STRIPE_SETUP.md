# MeSnap Stripe Integration Setup

This document provides instructions for setting up the MeSnap Stripe integration, which consists of:

1. Frontend code hosted on GitHub Pages
2. Backend server hosted on Railway

## Overview

The MeSnap e-commerce site uses Stripe's Embedded Checkout to process payments. The payment flow works as follows:

1. User adds items to cart on the GitHub Pages website
2. User clicks "Checkout" button
3. Frontend sends cart data to the backend
4. Backend creates a Stripe checkout session and returns the client secret
5. Frontend redirects to the checkout page and initializes Stripe's embedded checkout UI
6. User completes payment through Stripe's UI
7. Stripe redirects back to the success page on GitHub Pages
8. Success page verifies the payment status with the backend
9. Cart is cleared upon successful payment

## Stripe Setup

1. Create a Stripe account and activate it
2. Create products and prices in the Stripe dashboard:
   - Each color variant should have its own price ID
   - Prices should match what's displayed on the website
3. Obtain the Stripe API keys:
   - `STRIPE_API_KEY` (Secret key) 
   - `STRIPE_PUBLIC_KEY` (Publishable key)

## Backend (Railway) Deployment

1. Create a new project on Railway
2. Link to the GitHub repository containing the server code
3. Set the following environment variables in Railway:
   - `STRIPE_API_KEY`: Your Stripe secret key
   - `GITHUB_PAGES_URL`: The URL of your GitHub Pages site (default: https://mesnap-app.github.io)
   - `DOMAIN_URL`: The URL of your Railway app (will be provided by Railway after deployment)
   - `SUCCESS_URL`: The URL of your success page (default: https://mesnap-app.github.io/payment-success.html)

4. Deploy the application
5. Note the Railway app URL (e.g., https://mesnap-stripe.up.railway.app)

## Frontend Configuration

1. Update the following files with the correct URLs:
   - In `cart.html`, `stripe-checkout.html`, and `payment-success.html`, update the `MESNAP_CONFIG` object:
     ```javascript
     window.MESNAP_CONFIG = {
         STRIPE_BACKEND_URL: 'https://your-railway-app-url.up.railway.app',
         STRIPE_PUBLIC_KEY: 'pk_live_your_stripe_publishable_key'
     };
     ```

2. Push the changes to the GitHub repository

## Testing the Integration

1. Make sure both the GitHub Pages site and Railway backend are deployed
2. Test the full checkout flow:
   - Add items to cart
   - Click Checkout
   - Complete the Stripe checkout form (use Stripe test card numbers)
   - Verify redirect to success page
   - Verify cart is cleared after successful payment

### Stripe Test Card Numbers

Use these card numbers for testing:

- Successful payment: 4242 4242 4242 4242
- Failed payment: 4000 0000 0000 0002

For all test cards:
- Any future expiration date (MM/YY)
- Any 3-digit CVC
- Any postal code

## Troubleshooting

- **CORS issues**: Make sure the `GITHUB_PAGES_URL` in the Railway environment variables matches your actual GitHub Pages URL
- **404 Not Found**: Check that the backend URL in the frontend configuration is correct
- **Payment failure**: Verify that your Stripe account is properly set up and that the product price IDs match those in your Stripe dashboard
- **Redirect issues**: Make sure the `SUCCESS_URL` environment variable is correctly set on Railway

## Production Considerations

1. Use Stripe webhooks for more reliable order processing
2. Implement inventory management to prevent overselling
3. Add order confirmation emails
4. Consider adding order history functionality