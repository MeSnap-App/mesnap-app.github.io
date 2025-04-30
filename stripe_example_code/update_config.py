#!/usr/bin/env python3
"""
Simple script to update Stripe publishable key in checkout.js
Usage: python update_config.py [publishable_key]
"""

import sys
import os
import re

def update_publishable_key(new_key):
    checkout_js_path = os.path.join('public', 'checkout.js')
    
    # Read the file
    with open(checkout_js_path, 'r') as file:
        content = file.read()
    
    # Update the Stripe publishable key
    updated_content = re.sub(
        r'const stripe = Stripe\("([^"]*)"\);',
        f'const stripe = Stripe("{new_key}");',
        content
    )
    
    # Write back to the file
    with open(checkout_js_path, 'w') as file:
        file.write(updated_content)
    
    print(f"Updated Stripe publishable key to: {new_key}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update_config.py [publishable_key]")
        sys.exit(1)
    
    new_key = sys.argv[1]
    update_publishable_key(new_key)