#!/bin/bash

# News Aggregator Runner Script
# This script sets up the environment and runs the news aggregator

# Change to script directory
cd "$(dirname "$0")"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "ERROR: .env file not found. Copy .env.example to .env and configure it."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
pip install -q -r requirements.txt

# Run the aggregator
python3 news_aggregator.py

# Deactivate virtual environment
deactivate
