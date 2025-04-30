#!/bin/bash

# Serve the frontend files on port 8000
echo "Starting frontend server on http://localhost:8000"
echo "Press Ctrl+C to stop"

# Run Python's built-in HTTP server
python3 -m http.server 8000