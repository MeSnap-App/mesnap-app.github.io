#! /usr/bin/env python3.6

"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS

import stripe
# Get API key from environment variable - must be set in production
if 'STRIPE_API_KEY' not in os.environ:
    raise ValueError("STRIPE_API_KEY environment variable must be set")
    
stripe.api_key = os.environ['STRIPE_API_KEY']

app = Flask(__name__,
            static_url_path='',
            static_folder='public')

# Enable CORS for all routes from the GitHub Pages domain
GITHUB_PAGES_URL = os.environ.get('GITHUB_PAGES_URL', '*')
CORS(app, resources={
    r"/*": {"origins": GITHUB_PAGES_URL, "supports_credentials": True}
})

# Get domain from environment variable - must be set in production
if 'DOMAIN_URL' not in os.environ:
    raise ValueError("DOMAIN_URL environment variable must be set")
    
YOUR_DOMAIN = os.environ['DOMAIN_URL']

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        print("Request Content-Type:", request.headers.get('Content-Type'))
        print("Request body:", request.get_data(as_text=True))
        
        data = request.get_json() if request.is_json else {}
        print("Parsed JSON data:", data)
        
        items = data.get('items', [])
        print("Items from request:", items)
        
        # Filter out items with zero quantity
        line_items = []
        
        # If no items data was passed, use default quantities
        if not items:
            print("No items data, using defaults")
            line_items = [
                {
                    'price': 'price_1RJ1FNAIKeA0MU3RRAXRcoCZ',
                    'quantity': 1,
                },
                {
                    'price': 'price_1RJ1EsAIKeA0MU3RFaNyWzNO',
                    'quantity': 1,     
                }
            ]
        else:
            # Add items with quantity > 0
            for item in items:
                print("Processing item:", item)
                quantity = item.get('quantity', 0)
                item_id = item.get('id')
                print(f"Item ID: {item_id}, Quantity: {quantity}")
                
                if quantity > 0:
                    line_items.append({
                        'price': item_id,
                        'quantity': quantity
                    })
        
        print("Final line_items:", line_items)
        
        # Make sure there's at least one item
        if not line_items:
            print("No items selected")
            return jsonify(error="Please select at least one product"), 400
            
        print("Creating Stripe session with line items:", line_items)
        session = stripe.checkout.Session.create(
            ui_mode = 'embedded',
            line_items=line_items,
            mode='payment',
            return_url=YOUR_DOMAIN + '/return.html?session_id={CHECKOUT_SESSION_ID}',
        )
        print("Stripe session created:", session.id)
    except Exception as e:
        print("Error creating checkout session:", str(e))
        return str(e)

    return jsonify(clientSecret=session.client_secret)

@app.route('/session-status', methods=['GET'])
def session_status():
  session = stripe.checkout.Session.retrieve(request.args.get('session_id'))

  return jsonify(status=session.status, customer_email=session.customer_details.email)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 4242))
    app.run(host='0.0.0.0', port=port)