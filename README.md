# MeSnap.App Website

This is the official website for MeSnap, a MagSafe-compatible ID card holder with NFC technology designed for university students.

## Project Overview

MeSnap.App is an e-commerce website that allows customers to:
- Learn about the MeSnap product
- View and interact with a 3D preview of the product
- Select color options and quantity
- Add items to cart and checkout
- Contact support and find answers to common questions

## Features

- Responsive design that works on mobile, tablet, and desktop
- Interactive 3D product preview with three.js
- Color selection with visual feedback on the 3D model
- Dynamic pricing with discount support
- Shopping cart with localStorage persistence
- Checkout process with Apple Pay support
- Contact form with validation
- FAQ section with filtering and search
- Dynamic product data loading (for future integration with Firebase)

## File Structure

- `/` - Root directory with HTML files
- `/css` - Stylesheets
- `/js` - JavaScript files
- `/images` - Product and UI images
- `/assets` - Additional assets like fonts
- `/models` - 3D models (GLB format)
- `/data` - JSON data files (product info, etc.)

## Setup Instructions

1. Make sure all image files are placed in the `/images` directory as specified in the `images/README.md` file.

2. Place the 3D model files in the `/models` directory:
   - `mesnap.glb` - The MeSnap ID card holder model
   - `iphone16.glb` - The iPhone model

3. To run the site locally:
   - Use a local development server like Live Server (VS Code extension)
   - Or use Python's built-in HTTP server:
     ```
     python -m http.server
     ```
   - Navigate to `http://localhost:8000` in your browser

## 3D Model Configuration

The website uses three.js to create an interactive 3D product viewer. The models can be configured in the `data/products.json` file under the `modelPositioning` property:

```json
"modelPositioning": {
  "mesnap": {
    "scale": 1,
    "position": {"x": 0, "y": 0, "z": 0},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "phone": {
    "scale": 1,
    "position": {"x": 0, "y": 0, "z": -0.1},
    "rotation": {"x": 0, "y": 0, "z": 0}
  },
  "colorMaterial": "body"
}
```

This allows for easy adjustment of the models' positions, scales, and rotations without modifying the 3D files themselves.

## Development Roadmap

### Phase 1 (Current)
- Static website with local data storage
- Basic e-commerce functionality
- 3D product preview with three.js

### Phase 2 (Planned)
- Integration with Firebase for product data
- Backend implementation for order processing
- User accounts and order history
- Advanced 3D interaction and animations

## Technologies Used

- HTML5
- CSS3 (with CSS variables for theming)
- JavaScript (Vanilla)
- three.js for 3D model rendering
- JSON for data storage
- Local Storage for cart persistence

## Color Scheme

- Primary: #7F00FF (Purple)
- Primary Light: #BAA2CD (Light Purple)
- Secondary: #FBF6EF (Off-white/Cream)
- Accent: #FF9500 (Bright Orange)

## Browser Compatibility

The website is designed to work on modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

For the 3D viewer, WebGL support is required. The site provides a fallback to static images for browsers without WebGL support.

## Contact

For any questions, please reach out to support@mesnap.app# MeSnap-App
