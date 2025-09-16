#!/bin/bash
# Simple N8N-Style Web UI Start (No Greenlet Build Issues)

echo "🚀 Starting N8N-Style Web Automation Toolkit (Simple Mode)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install core dependencies manually to avoid build issues
echo "📚 Installing core dependencies..."
pip install --upgrade pip

# Install Flask and dependencies
echo "🌐 Installing Flask..."
pip install flask==2.3.3

# Install SocketIO with threading backend (no greenlet needed)
echo "🔌 Installing SocketIO (threading mode)..."
pip install flask-socketio==5.3.6 --no-deps
pip install python-socketio python-engineio bidict

# Install Playwright
echo "🎭 Installing Playwright..."
pip install playwright==1.40.0

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
playwright install chromium

# Check if workflows_json directory exists
if [ ! -d "workflows_json" ]; then
    echo "📁 Creating workflows_json directory..."
    mkdir workflows_json
fi

# Start the application
echo "🌟 Starting N8N-Style Web UI (Simple Mode)..."
echo "📱 Interface will be available at: http://localhost:5001"
echo "🔄 Press Ctrl+C to stop the server"
echo "✅ This version avoids all build compilation issues!"
echo ""

# Set SocketIO to use threading mode explicitly
export FLASK_SOCKETIO_ASYNC_MODE=threading

# Run the application
python app.py