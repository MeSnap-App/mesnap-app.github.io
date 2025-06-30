# MeSnap E-commerce Website - Project Memory

## Project Overview
MeSnap is an e-commerce website selling MagSafe phone accessories for sharing contact info with NFC and storing ID cards. The site features a 3D product viewer with dynamic color switching.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **3D Rendering**: model-viewer (Google) for GLB file display
- **Database**: Supabase (PostgreSQL)
- **Payment**: Stripe integration
- **3D Model**: Single `mesnap.glb` file with material color switching

## Project Structure
```
mesnap-app.github.io/
├── product/
│   └── index.html          # Main product page
├── js/
│   ├── product.js          # Core product functionality
│   ├── main.js            # Site-wide scripts
│   ├── faq.js             # FAQ page functionality
│   └── contact.js         # Contact page functionality
├── css/
│   ├── style.css          # Main styles
│   └── product.css        # Product page styles
├── models/
│   └── mesnap.glb         # Single 3D model (397KB)
├── images/
│   └── shopping_cart_images/  # Product images for cart
└── colour_test/
    └── index.html         # Color switching test implementation
```

## Database Schema (Supabase)
**Table: `products`**
- `id` (text, primary key) - 3-character SKU (e.g., "mmy")
- `name` (text) - Product display name
- `colour_name` (text) - Display color name (e.g., "Mango Yellow")
- `colour_hex` (text) - UI color hex (without #)
- `3d_model_hex` (text) - 3D model material color hex (without #)
- `3d_model_metalness` (float) - Material metalness (0-1)
- `3d_model_roughness` (float) - Material roughness (0-1)
- `price` (decimal) - Product price
- `currency` (text) - Currency symbol
- `stock` (integer) - Available quantity
- `stripe_price_id` (text) - Stripe price ID for payments
- `description` (text) - Product description
- `is_active` (boolean) - Product visibility
- `sort_order` (integer) - Display order
- `images` (json) - Image URLs object: `{"primary": "url", "gallery": ["url1"], "cart": "url"}`

**Sample Data:**
```
id: "mmy"
name: "MeSnap Mango Yellow"
colour_name: "Mango Yellow"
colour_hex: "FFEB3B"
3d_model_hex: "FFEB3B"
3d_model_metalness: 0.7
3d_model_roughness: 0.5
price: 14.95
currency: "£"
stock: 300
stripe_price_id: "price_1Re3EhAIKeA0MU3R5aRQo6Jb"
description: "A Mango Yellow MeSnap. Bold and expressive"
is_active: true
sort_order: 1
```

## Key Features Implemented

### 3D Model System
- **Single GLB File**: Uses `mesnap.glb` (one model for all colors)
- **Material Color Switching**: Changes material color via `setBaseColorFactor()`
- **Dynamic Material Properties**: Metalness and roughness per product from database
- **Initial Properties**: Default metalness=0.5, roughness=0.7
- **Model Positioning**: Configurable scale, positioning with tweakable parameters

### Color Management
- **Dynamic Color Options**: Generated from Supabase data
- **No Hardcoded Colors**: Removed static HTML color buttons
- **Database-Driven**: Uses `colour_hex` for UI, `3d_model_hex` for 3D model
- **Material Properties**: Individual metalness/roughness per color variant

### Product Data Flow
1. **Model Loads Immediately**: Independent of database status
2. **Supabase Data Fetch**: Loads product variants asynchronously
3. **Color Options Generation**: Creates UI buttons from database
4. **Initial Color Application**: Applies first product's color (100ms delay)
5. **Graceful Fallback**: Works offline with basic functionality

### Supabase Integration
- **Configuration**: 
  - URL: `https://xbqrmfsezvyxfdhfgele.supabase.co`
  - Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Query**: `SELECT * FROM products WHERE is_active = true ORDER BY sort_order ASC`
- **Error Handling**: Fallback mode when database unavailable

## Critical Functions

### `initModelViewer()`
- Initializes 3D model viewer
- Applies default material properties (metalness: 0.5, roughness: 0.7)
- Handles model loading, positioning, and AR setup
- Independent of database status

### `loadProductData()`
- Fetches products from Supabase asynchronously
- Sets `selectedProduct` and `productData` globals
- Returns data for chaining with other initializations

### `updateModelColor(colorName)`
- Finds product by color name in database
- Applies `3d_model_hex`, `3d_model_metalness`, `3d_model_roughness`
- Handles both immediate and deferred color application
- 100ms timeout for material loading safety

### `initColorSelection()`
- Dynamically generates color picker from database
- Clears hardcoded HTML options
- Creates click handlers for color switching
- Updates price, stock, and 3D model on selection

## Timing Configuration
- **Initial Color Application**: 100ms delay after data loads
- **Material Change Timeout**: 100ms for model-viewer safety
- **Model Position Timeout**: 10ms for material property application
- **Confirmation Display**: 3000ms for cart confirmations

## Removed Elements
- ❌ Hardcoded color buttons in HTML
- ❌ Static discount badges (25% Off, £19.95 original price)
- ❌ Multiple GLB files per color
- ❌ Hardcoded color mapping in JavaScript

## Current Status
- ✅ Single GLB model with color switching working
- ✅ Supabase integration implemented
- ✅ Dynamic color options from database
- ✅ Material properties per product variant
- ✅ Graceful fallback when database unavailable
- ✅ Cart integration with Stripe price IDs
- ❓ Supabase connection needs verification (404 errors)

## Future Enhancements
- Discount system using database fields
- Multiple product categories
- Image gallery from `images` JSON field
- Related products recommendations
- Real-time stock updates