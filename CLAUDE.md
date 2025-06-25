# MeSnap App Project Status

## Overview
The MeSnap app is an e-commerce website for selling MagSafe ID Card Holders with integrated NFC tags for easy contact sharing. The website features responsive design, 3D model visualization, color selection, and a complete checkout flow with Stripe payment processing.

## Current Status
- **Frontend**: Deployed on GitHub Pages/custom domain (mesnap.app)
- **Backend**: Deployed on Railway (handles Stripe payment integration)
- **Payment Processing**: Integrated with Stripe Checkout
- **Current Version**: 1.0

## Features Implemented
- **Product Display**:
  - Interactive 3D model visualization with WebGL
  - Color selection with real-time model updates
  - Color-specific pricing
  - Product details and features section

- **Shopping Cart**:
  - Add/remove items
  - Adjust quantities
  - Color-specific images in cart
  - Persistent storage using localStorage
  - Order summary with subtotal, shipping, and total

- **Checkout Process**:
  - Integration with Stripe Checkout
  - Shipping options (Standard £1.00, Express £2.00)
  - Payment processing with secure handling
  - Success page after purchase

- **Responsive Design**:
  - Mobile-optimized layout
  - Improved cart display on small screens

## Technical Details
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Python with Flask
- **Payment**: Stripe API
- **3D Models**: GLB format with model-viewer web component
- **Deployment**: GitHub Pages (frontend), Railway (backend)

## Configuration
- Stripe live keys are configured
- Domain verification for mesnap.app is set up
- CORS is configured to allow requests from allowed domains
- Environment variables are set in Railway for secure API key storage

## Recent Changes
- Fixed mobile layout issues in the cart
- Resolved checkout failures by correcting payment method types
- Updated shipping fees to match business requirements (£1.00 standard, £2.00 express)
- Added color-specific cart thumbnails 
- Removed redundant checkout modal
- Standardized all product prices to £19.99
- Removed tax calculation (now set to 0%)

## Pending
- Apple Pay integration (requires additional domain verification)
- Email confirmation after purchase
- Order history functionality
- Inventory management system
