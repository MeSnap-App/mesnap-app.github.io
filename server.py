#! /usr/bin/env python3
"""
MeSnap Stripe Payment Server
Python 3.6 or newer required.

This server is designed to be deployed on Railway and integrated with the
MeSnap.App website hosted on GitHub Pages.
"""
import os
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS

import stripe

app = Flask(__name__)

# Get API key from environment variable
stripe.api_key = os.environ.get('STRIPE_API_KEY')
if not stripe.api_key:
    raise ValueError("STRIPE_API_KEY environment variable must be set")

# Enable CORS for all domains
GITHUB_PAGES_URL = os.environ.get('GITHUB_PAGES_URL', 'https://mesnap-app.github.io')
CUSTOM_DOMAIN = os.environ.get('CUSTOM_DOMAIN', 'https://mesnap.app')
CORS(app, resources={
    r"/*": {"origins": [GITHUB_PAGES_URL, CUSTOM_DOMAIN, "http://localhost:*", "*"], "supports_credentials": True}
})

# Get domain URL - will be the Railway app URL
DOMAIN_URL = os.environ.get('DOMAIN_URL')
if not DOMAIN_URL:
    print("WARNING: DOMAIN_URL environment variable not set. Using default.")
    DOMAIN_URL = "https://mesnap-stripe.up.railway.app"

# Set success URL for production
if os.environ.get('LOCAL_TESTING', 'false').lower() == 'true':
    # When testing locally
    SUCCESS_URL = 'http://localhost:8000/payment-success.html'
else:
    # Production mode
    # Get success redirect URL from environment or use custom domain by default
    SUCCESS_URL = os.environ.get('SUCCESS_URL')
    if not SUCCESS_URL:
        # Default to using the custom domain for success URL
        SUCCESS_URL = f"{CUSTOM_DOMAIN}/payment-success.html"
        
        # Log which domain we're using
        print(f"Using custom domain for success URL: {SUCCESS_URL}")
print(f"Final success URL: {SUCCESS_URL}")

@app.route('/')
def index():
    return """
    <html>
        <head><title>MeSnap Payment Server</title></head>
        <body>
            <h1>MeSnap Stripe Payment Server</h1>
            <p>This server handles Stripe payment processing for MeSnap.App.</p>
            <p>Server is running and ready to accept requests.</p>
        </body>
    </html>
    """

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        print("Processing checkout request")
        print("Request headers:", dict(request.headers))
        print("Request Origin:", request.headers.get('Origin'))
        print("Request Content-Type:", request.headers.get('Content-Type'))
        
        # Parse JSON data
        data = request.get_json() if request.is_json else {}
        print("Parsed JSON data:", data)
        
        items = data.get('items', [])
        print("Items from request:", items)
        
        # Filter out items with zero quantity
        line_items = []
        
        # If no items data was passed, return error
        if not items:
            print("No items provided")
            return jsonify(error="No items provided"), 400
        
        # Add items with valid IDs
        for item in items:
            item_id = item.get('id')
            quantity = item.get('quantity', 0)
            print(f"Processing item: ID={item_id}, Quantity={quantity}")
            
            if not item_id or quantity <= 0:
                continue
                
            line_items.append({
                'price': item_id,
                'quantity': quantity
            })
        
        print("Final line_items:", line_items)
        
        # Make sure there's at least one item
        if not line_items:
            print("No valid items to purchase")
            return jsonify(error="No valid items to purchase"), 400
        
        # Create Stripe session
        print("Creating Stripe checkout session")
        try:
            session = stripe.checkout.Session.create(
                ui_mode='embedded',
                line_items=line_items,
                mode='payment',
                return_url=f"{SUCCESS_URL}?session_id={{CHECKOUT_SESSION_ID}}",
                shipping_address_collection={
                    'allowed_countries': ['GB', 'US', 'CA', 'AU'],
                },
                shipping_options=[
                    {
                        'shipping_rate_data': {
                            'type': 'fixed_amount',
                            'fixed_amount': {
                                'amount': 499,
                                'currency': 'gbp',
                            },
                            'display_name': 'Standard Shipping',
                            'delivery_estimate': {
                                'minimum': {
                                    'unit': 'business_day',
                                    'value': 5,
                                },
                                'maximum': {
                                    'unit': 'business_day',
                                    'value': 10,
                                },
                            }
                        }
                    },
                    {
                        'shipping_rate_data': {
                            'type': 'fixed_amount',
                            'fixed_amount': {
                                'amount': 999,
                                'currency': 'gbp',
                            },
                            'display_name': 'Express Shipping',
                            'delivery_estimate': {
                                'minimum': {
                                    'unit': 'business_day',
                                    'value': 2,
                                },
                                'maximum': {
                                    'unit': 'business_day',
                                    'value': 5,
                                },
                            }
                        }
                    },
                ]
            )
            print("Session created with ID:", session.id)
            print("Client secret:", session.client_secret[:10] + "...")
        except stripe.error.StripeError as e:
            print("Stripe error creating session:", str(e))
            raise e
        print("Session created:", session.id)
        
        # Return client secret
        return jsonify(clientSecret=session.client_secret)
    
    except Exception as e:
        print("Error creating checkout session:", str(e))
        return jsonify(error=str(e)), 500

@app.route('/session-status', methods=['GET'])
def session_status():
    try:
        session_id = request.args.get('session_id')
        if not session_id:
            return jsonify(error="No session_id provided"), 400
            
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Extract session information
        status = session.status
        customer_email = None
        
        if hasattr(session, 'customer_details') and session.customer_details:
            customer_email = session.customer_details.email
            
        return jsonify(status=status, customer_email=customer_email)
    
    except Exception as e:
        print("Error retrieving session status:", str(e))
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4242))
    
    # Print environment info for debugging
    print("-" * 50)
    print("Server starting with configuration:")
    print(f"API Key: {'Configured' if stripe.api_key else 'MISSING'}")
    print(f"CORS Origins: {GITHUB_PAGES_URL}, {CUSTOM_DOMAIN}")
    print(f"Domain URL: {DOMAIN_URL}")
    print(f"Success URL: {SUCCESS_URL}")
    print(f"Port: {port}")
    print("-" * 50)
    
    app.run(host='0.0.0.0', port=port)