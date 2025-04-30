# Deploying to Railway

## Prerequisites
- A Railway account
- Railway CLI installed (optional)

## Deployment Steps

### Method 1: Using Railway CLI

1. Install Railway CLI if you haven't already:
```bash
npm i -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize a new Railway project:
```bash
railway init
```

4. Deploy the application:
```bash
railway up
```

5. Set environment variables:
```bash
railway variables set STRIPE_API_KEY=sk_your_stripe_key_here
railway variables set DOMAIN_URL=https://your-railway-app-url.railway.app
```

### Method 2: Using Railway Dashboard

1. Push your code to a GitHub repository

2. Go to [Railway Dashboard](https://railway.app/dashboard)

3. Click "New Project" and select "Deploy from GitHub repo"

4. Select your repository and branch

5. Railway will automatically detect the Python project and set up deployment

6. Add the required environment variables in the Railway dashboard:
   - `STRIPE_API_KEY`: Your Stripe API key
   - `DOMAIN_URL`: The URL of your Railway app (e.g., https://your-app.railway.app)

## Important Notes

- Make sure to use test Stripe keys during development and testing
- Update the DOMAIN_URL to your production URL when going live
- You may need to update the Publishable Key in `checkout.js` to match your environment
- For production, consider storing your Stripe keys securely in Railway's environment variables