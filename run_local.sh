#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  source .env
fi

# Check if Stripe API key is set
if [ -z "$STRIPE_API_KEY" ]; then
  echo "Error: STRIPE_API_KEY environment variable is not set"
  echo "Please add your Stripe secret key to a .env file like:"
  echo "export STRIPE_API_KEY='sk_test_your_key'"
  exit 1
fi

# Set environment variables for local testing
export LOCAL_TESTING=true
export PORT=4242

# Run the server
python3 server.py