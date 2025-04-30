# MeSnap Stripe Integration Deployment Guide

This guide will walk you through deploying the MeSnap Stripe integration, which consists of:

1. Frontend code hosted on GitHub Pages or your custom domain (mesnap.app)
2. Backend server hosted on Railway

## Prerequisites

- A Stripe account with API keys
- A Railway account
- Products and price IDs created in Stripe

## Deploying the Backend to Railway

1. Log in to Railway and create a new project
2. Connect your repository or use the GitHub integration
3. Set the following environment variables in Railway:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `STRIPE_API_KEY` | Your Stripe secret API key | `sk_live_51abc123...` |
| `GITHUB_PAGES_URL` | Your GitHub Pages URL | `https://mesnap-app.github.io` |
| `CUSTOM_DOMAIN` | Your custom domain (if any) | `https://mesnap.app` |
| `USE_CUSTOM_DOMAIN` | Whether to use custom domain for success redirects | `true` |
| `SUCCESS_URL` | Override for the success URL (optional) | `https://mesnap.app/payment-success.html` |

4. Set the service name to something recognizable (e.g., "mesnap-stripe")
5. Deploy the project

Railway will automatically detect the Python project, install dependencies from requirements.txt, and start the server using the command specified in the Procfile.

## Updating Frontend Configuration

After deploying to Railway, update the configuration in your frontend HTML files to point to your Railway deployment URL:

1. Get your Railway deployment URL from the Railway dashboard (e.g., `https://mesnap-appgithubio-production.up.railway.app`)
2. Update this URL in the following files:
   - `cart.html`
   - `stripe-checkout.html`
   - `payment-success.html`

The configuration section in each file should look like:

```html
<script>
    window.MESNAP_CONFIG = {
        STRIPE_BACKEND_URL: 'https://your-railway-app-url.up.railway.app',
        STRIPE_PUBLIC_KEY: 'pk_live_your_stripe_publishable_key'
    };
</script>
```

## Testing the Deployment

1. Push all changes to GitHub
2. Verify the frontend is correctly deployed on GitHub Pages or your custom domain
3. Test the checkout flow by:
   - Adding products to the cart
   - Clicking Checkout
   - Completing the payment through Stripe's interface
   - Verifying you're redirected to the success page

## Monitoring and Troubleshooting

### Railway Logs

Check the Railway logs for any errors or warnings. Common issues include:

- CORS problems: Check that the CORS configuration includes your actual domain
- Stripe API key issues: Verify the key is correctly set and valid
- Return URL problems: Ensure the success URL is correctly configured

### Stripe Dashboard

Monitor payments in the Stripe Dashboard:

1. Go to Stripe Dashboard > Payments
2. Look for test or live payments depending on your mode
3. Review any failed payments and their error messages

### Common Issues

1. **CORS errors**: Make sure your domain is correctly set in the CORS configuration
2. **Missing products**: Ensure all product IDs in your frontend match those in Stripe
3. **Redirect issues**: Verify that SUCCESS_URL is correctly configured
4. **API key problems**: Make sure you're using the correct API key for test/live mode

## Going into Production

When ready to go live:

1. Ensure you're using the live Stripe API keys
2. Test the entire checkout flow with real products
3. Set `STRIPE_API_KEY` to your live key in Railway
4. Update the `STRIPE_PUBLIC_KEY` in your frontend code to the live key

## Updating Products

When adding or changing products:

1. Create/update products and prices in the Stripe Dashboard
2. Note the price_id for each product/variant
3. Update the products.json file with the new price_ids
4. Test the checkout flow with the new products

Remember that any changes to the backend require a new deployment on Railway, while frontend changes need to be pushed to GitHub (and will automatically deploy to GitHub Pages).